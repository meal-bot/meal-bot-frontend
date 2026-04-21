import Navigationbar from './Navigationbar';
import Sidebar from './Sidebar';

/**
 * Layout - 전체 페이지의 공통 뼈대 컴포넌트
 *
 * sidebarOpen / onSidebarToggle 을 외부(MainPage)에서 받는 제어 컴포넌트
 * → MainPage가 sidebarOpen 상태를 소유하므로 ChatInput 등 하위 컴포넌트에도 직접 전달 가능
 *
 * props:
 *   sidebarOpen     : 사이드바 열림 여부 (MainPage에서 관리)
 *   onSidebarToggle : 토글 버튼 클릭 시 MainPage의 상태를 반전하는 콜백
 *   onNewChat       : 새 채팅 버튼 → MainPage.startNewChat
 *   onSessionSelect : 대화 클릭   → MainPage.loadConversation
 */
export default function Layout({ children, sidebarOpen, onSidebarToggle, onNewChat, onSessionSelect }) {
  return (
    <div className="text-on-surface selection:bg-primary-container">

      {/* 네비게이션 바: sidebarOpen을 받아 로고 위치를 사이드바 너비에 맞게 이동 */}
      <Navigationbar sidebarOpen={sidebarOpen} />

      {/*
        사이드바:
          isOpen   → 현재 열림 상태 전달
          onToggle → 버튼 클릭 시 MainPage의 상태를 반전(true↔false)
      */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={onSidebarToggle}
        onNewChat={onNewChat}
        onSessionSelect={onSessionSelect}
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
