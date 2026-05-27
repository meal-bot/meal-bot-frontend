import Navigationbar from './Navigationbar';
import ChatSidebar from '../../../features/chat/components/ChatSidebar';

/**
 * Layout - 전체 페이지의 공통 뼈대 컴포넌트
 *
 * props:
 *   sidebarOpen        : 사이드바 열림 여부 (MainPage에서 관리)
 *   onSidebarToggle    : 토글 버튼 클릭 시 MainPage의 상태를 반전하는 콜백
 *   onStartNewChat     : 새 채팅 버튼 → MainPage.startNewChat
 *   chats              : 채팅 목록 (MainPage의 useChat에서 관리)
 *   onOpenExistingChat : 채팅 클릭   → MainPage.openExistingChat
 *   onDeleteChat       : X 버튼 클릭  → MainPage.deleteChat
 */
export default function Layout({ children, sidebarOpen, onSidebarToggle, onStartNewChat,
                                 chats, onOpenExistingChat, onDeleteChat }) {
  return (
    <div className="text-on-surface selection:bg-primary-container">

      {/* 네비게이션 바: sidebarOpen을 받아 로고 위치를 사이드바 너비에 맞게 이동 */}
      <Navigationbar sidebarOpen={sidebarOpen} onStartNewChat={onStartNewChat} />

      {onSidebarToggle && (
        <ChatSidebar
          isOpen={sidebarOpen}
          onToggle={onSidebarToggle}
          onStartNewChat={onStartNewChat}
          chats={chats}
          onOpenExistingChat={onOpenExistingChat}
          onDeleteChat={onDeleteChat}
        />
      )}

      <main
        className={`pt-24 md:pt-32 pb-40 px-4 md:pr-12 max-w-screen-2xl mx-auto transition-all duration-300 ${
          onSidebarToggle && sidebarOpen ? 'md:pl-64' : 'md:pl-16'
        }`}
      >
        {children}
      </main>

    </div>
  );
}
