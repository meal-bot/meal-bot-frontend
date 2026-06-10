# CODEX.md

This file provides guidance to Codex when working with code in this repository.

## Commands

```bash
npm run dev       # 개발 서버 (Vite, localhost:5173)
npm run build     # 프로덕션 빌드
npm run lint      # ESLint 검사
npm run preview   # 빌드 결과물 미리보기
```

테스트 프레임워크는 미설치. 기능 검증은 `npm run dev`로 직접 확인.

디자인 브랜치 작업을 이어갈 때는 최신 맥락과 임시 결정사항을 `DESIGN_NOTES.md`에서 함께 확인한다.

## 환경 변수

`.env.example`을 복사해 `.env.local` 생성:

```
VITE_API_BASE_URL=https://api.obob.site   # Spring Boot 백엔드
```

## 아키텍처

### 디렉터리 구조

`src/features/{feature}/` 단위로 기능을 격리한다. 각 feature 내부:

- `pages/` — 라우트에 직접 마운트되는 페이지 컴포넌트
- `components/` — 해당 feature 전용 UI 컴포넌트
- `api/` — Spring API 호출 함수 (axiosInstance 사용)
- `hooks/` — 커스텀 훅 (현재 `useChat`만 존재)
- `data/` — 목업/정적 데이터 (백엔드 전환 전 임시)

공통 코드는 `src/shared/` — `components/`, `context/`, `hooks/`, `utils/`

### HTTP 클라이언트

`src/api/axiosInstance.js` — 앱 전체의 단일 Axios 인스턴스.

- `baseURL`: `VITE_API_BASE_URL`
- 기본 timeout: 5초 (AI 응답이 필요한 채팅·냉장고는 각 API 모듈에서 60초로 오버라이드)
- 요청 인터셉터가 `localStorage`의 JWT를 `Authorization: Bearer` 헤더에 자동 삽입. 토큰 없으면 헤더 미포함(비로그인 허용)

### 인증

`src/features/auth/utils/auth.js`에서 `localStorage`에 `token`·`name` 저장/조회.  
로그인: Spring의 OAuth2 redirect (`/oauth2/authorization/google|kakao`) → `OAuthCallbackPage`에서 JWT 수신.  
`ProtectedRoute`(App.jsx)가 `/fridge`, `/calendar`, `/inbody`를 보호.

### 채팅 시스템

`useChat` 훅(`src/features/chat/hooks/useChat.js`)이 채팅 관련 상태를 일원 관리.

- **로그인 사용자**: JWT 인증 + `/api/chat/:id/sendMessage`
- **게스트**: 쿠키 기반 서버 세션 (`withCredentials: true`) + `/api/chat/guest/sendMessage`. 문맥은 서버에서 최대 1시간 유지; 새로고침 시 세션 초기화됨.
- 이중 submit 방지: `isSubmittingRef`(ref) 사용
- AI 응답 도착 후 40ms/글자 타이핑 애니메이션 (`typeMessage`)
- 응답 구조: `{ answer, recommendations, flags }`

### 캘린더

`/api/calendar/:date` (날짜별 상세)와 월 뷰를 별도로 처리:  
월 뷰는 `/api/chat` (사이드바 목록 API)를 재활용해 `createdAt` 기준으로 클라이언트에서 날짜별 그룹핑.

### 레이아웃

`Layout.jsx` — 모든 페이지 공통 뼈대. `Navigationbar` + 조건부 `ChatSidebar`를 포함.  
`ChatSidebar`는 `onSidebarToggle` prop이 있을 때만 렌더링(현재 `MainPage`에서만 전달).  
사이드바 열림 상태는 `SidebarContext`로 관리하지만, 실질적으로 `MainPage`에서만 소비 중.

### AI 추천 카드

채팅 응답의 `recommendations` 배열 → `RecommendationCards` 컴포넌트로 렌더링.  
추천 카드 클릭 → `RecipeDetailModal`로 상세 표시. 레시피 상세 데이터는 `GET /api/recipes/:id` (Python AI 백엔드 경유).

## API 엔드포인트 목록

| Feature | Method | Path | 설명 |
|---------|--------|------|------|
| Chat | POST | `/api/chat` | 새 채팅 생성 (로그인) |
| Chat | GET | `/api/chat` | 채팅 목록 조회 |
| Chat | GET | `/api/chat/:id` | 채팅 상세(메시지 포함) |
| Chat | POST | `/api/chat/:id/sendMessage` | 메시지 전송 + AI 응답 |
| Chat | DELETE | `/api/chat/:id` | 채팅 삭제 |
| Guest | POST | `/api/chat/guest` | 게스트 임시 채팅 생성 |
| Guest | POST | `/api/chat/guest/sendMessage` | 게스트 메시지 전송 |
| Guest | DELETE | `/api/chat/guest` | 게스트 임시 채팅 삭제 |
| InBody | POST | `/api/inbody` | 인바디 데이터 저장 |
| InBody | GET | `/api/inbody` | 내 기록 목록 조회 |
| InBody | DELETE | `/api/inbody/:id` | 기록 삭제 |
| Calendar | GET | `/api/calendar/:date` | 날짜별 추천 레시피 목록 |
| Fridge | POST | `/api/fridge/recommend` | 재료 기반 메뉴 추천 |
| Recipe | GET | `/api/recipes/random?count=N` | 무작위 레시피 N개 |
| Recipe | GET | `/api/recipes/:id` | 레시피 상세 |

## 배포

- **프론트**: Vercel (main 브랜치 자동 배포). `vercel.json`에 SPA 전용 rewrite 설정.
- **Spring 백엔드**: `https://api.obob.site`
- **Python AI 백엔드**: KT 클라우드
