import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 구글 OAuth 로그인 후 리디렉션되는 페이지
export default function OAuthCallbackPage() {
    const navigate = useNavigate();
    // handled: useEffect가 여러 번 실행되어도 토큰 처리를 딱 한 번만 하기 위한 방어 코드
    // - 개발 환경의 React StrictMode는 버그 감지를 위해 useEffect를 의도적으로 2번 실행함
    // - 운영 환경에서도 컴포넌트 재마운트 시 중복 실행될 수 있으므로 제거하지 말 것
    const handled = useRef(false);

    useEffect(() => {
        // URL에서 토큰 추출
        // 예: http://localhost:5173/oauth/callback?token=eyJhbGci...
        if (handled.current) return; // 이미 처리됐으면 즉시 종료 (중복 실행 방지)
        handled.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token != null) {
            console.log("로그인 성공 localStorage에 저장된 토큰: " + params.get('token')); // 토큰 확인용 로그
            localStorage.setItem('token', token); // 토큰 저장

            // JWT payload 디코딩해서 이름 저장
            try {
                const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
                console.log("JWT payload:", payload); // 어떤 필드가 있는지 확인용
                const name = payload.name || payload.given_name || payload.email || '';
                localStorage.setItem('name', name);
            } catch (e) {
                console.error("JWT 디코딩 실패:", e);
            }
            
            navigate('/');                         // 메인 페이지로 이동
        } else {
            console.log("로그인 실패"); // 토큰 확인용 로그
            navigate('/login');                    // 토큰 없으면 로그인 페이지로
        }
    }, [navigate]); // 컴포넌트가 처음 렌더링될 때만 실행

    return <div>로그인 처리 중...</div>;
}
