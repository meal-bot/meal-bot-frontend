import { useState } from 'react';
import Navigationbar from './Navigationbar';
import Sidebar from './Sidebar';

/**
 * Layout - 전체 페이지의 공통 뼈대 컴포넌트
 *
 * 역할:
 *   - 사이드바 열림/닫힘 상태(sidebarOpen)를 이 컴포넌트 하나에서 관리
 *   - Navigationbar와 Sidebar가 서로를 직접 알 필요 없이 props로 상태를 받음
 *   - children 자리에 각 페이지(예: MainPage)가 삽입됨
 *
 * 사용 예시:
 *   <Layout>
 *     <MainPage />   ← 이 컴포넌트가 children으로 전달되어 <main> 안에 렌더링됨
 *   </Layout>
 */
export default function Layout({ children }) {
  // 사이드바 열림 여부: false = 접힘(좁음), true = 펼침(넓음)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="text-on-surface selection:bg-primary-container">

      {/* 네비게이션 바: sidebarOpen을 받아 로고 위치를 사이드바 너비에 맞게 이동 */}
      <Navigationbar sidebarOpen={sidebarOpen} />

      {/*
        사이드바:
          isOpen  → 현재 열림 상태 전달
          onToggle → 사이드바 내부 버튼이 눌리면 여기서 상태를 반전(true↔false)
      */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />

      {/*
        페이지 본문 영역:
          - pt-32: 상단 고정 네비바 높이만큼 아래로 밀기
          - pb-40: 하단 고정 ChatInput 높이만큼 위로 밀기
          - pl-64 / pl-16: 사이드바가 열리면 넓게, 닫히면 좁게 (transition으로 부드럽게 전환)
      */}
      <main
        className={`pt-32 pb-40 pr-6 md:pr-12 max-w-screen-2xl mx-auto transition-all duration-300 ${
          sidebarOpen ? 'pl-64' : 'pl-16'
        }`}
      >
        {/* children: <Layout>...</Layout> 태그 사이에 넣은 페이지 컴포넌트가 여기에 렌더링됨 */}
        {children}
      </main>

    </div>
  );
}
