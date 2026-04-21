import { useEffect } from 'react';
import { useConversations } from '../hooks/useConversations';

// isOpen          : 사이드바 열림 여부 (Layout에서 관리)
// onToggle        : 토글 버튼 클릭 시 사이드바 상태 반전 콜백
// onNewChat       : 새 채팅 버튼 클릭 시 현재 대화 초기화 (MainPage → Layout → Sidebar)
// onSessionSelect : 대화 클릭 시 해당 대화 불러오기 (MainPage → Layout → Sidebar)
export default function Sidebar({ isOpen, onToggle, onNewChat, onSessionSelect }) {
  const isLoggedIn = !!localStorage.getItem('token');

  // <채팅> 대화 목록 조회 및 선택 로직은 useConversations 훅이 담당
  const { conversations, loadConversations, selectConversation } = useConversations(onSessionSelect);

  // 사이드바가 열릴 때마다 로그인 사용자의 대화 목록을 불러옴
  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;
    loadConversations();
  }, [isOpen, isLoggedIn, loadConversations]);

  return (
    <aside
      style={{ zIndex: 'var(--z-sidebar)' }}
      className={`fixed left-0 top-0 h-screen border-r border-outline-variant/30 bg-gray-100/80 backdrop-blur-sm flex flex-col py-4 gap-1 transition-all duration-300 ${isOpen ? 'w-60 px-3' : 'w-10.5 px-1'}`}
    >
      {/* 토글 버튼: 열림이면 menu_open, 닫힘이면 menu 아이콘 */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-container transition-colors self-end mb-1"
      >
        <span className="material-symbols-outlined text-base text-on-surface-variant">
          {isOpen ? 'menu_open' : 'menu'}
        </span>
      </button>

      {/* 사이드바가 열린 경우에만 내용 렌더링 */}
      {isOpen && (
        <>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-2">
            채팅 내역
          </p>

          {/* 로그인 시 서버 대화 목록, 비로그인 시 안내 문구 */}
          {isLoggedIn ? (
            conversations.length > 0 ? (
              conversations.map((conv) => (
                <button
                  key={conv.conversationId}
                  onClick={() => selectConversation(conv.conversationId)}
                  className="flex flex-col items-start px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-left w-full"
                >
                  <span className="text-sm font-medium text-on-surface truncate w-full">
                    {conv.title}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-0.5">
                    {conv.createdAt}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-on-surface-variant px-3 py-2">채팅 내역이 없습니다</p>
            )
          ) : (
            <p className="text-xs text-on-surface-variant px-3 py-2">로그인 후 내역이 저장됩니다</p>
          )}

          {/* 새 채팅 버튼: 항상 사이드바 하단에 고정 */}
          <div className="mt-auto">
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 채팅
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
