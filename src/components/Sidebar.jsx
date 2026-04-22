import { timeAgo } from '../utils/timeAgo';
import { isLoggedIn } from '../utils/auth';

// isOpen                : 사이드바 열림 여부 (Layout에서 관리)
// onToggle              : 토글 버튼 클릭 시 사이드바 상태 반전 콜백
// onNewChat             : 새 채팅 버튼 클릭 시 현재 대화 초기화 (MainPage → Layout → Sidebar)
// conversations         : 대화 목록 (useConversations를 MainPage로 올려 props로 전달받음)
// onConversationSelect  : 대화 클릭 시 해당 대화 불러오기 (MainPage → Layout → Sidebar)
// onConversationDelete  : X 버튼 클릭 시 해당 대화 삭제 (MainPage → Layout → Sidebar)
export default function Sidebar({ isOpen, onToggle, onNewChat, conversations, onConversationSelect, onConversationDelete }) {
  const loggedIn = isLoggedIn();

  return (
    <aside
      style={{ zIndex: 'var(--z-sidebar)' }}
      className={`fixed left-0 top-0 h-screen border-r border-outline-variant/30 bg-gray-100/80
      backdrop-blur-sm flex flex-col py-4 gap-1 transition-all duration-300 ${isOpen ? 'w-60 px-3' : 'w-10.5 px-1'}`}
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
          <p className="text-[14px] font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-2">
            대화 내역
          </p>

          {/* 새 채팅 버튼: 항상 사이드바 상단에 고정 */}
          <div>
            <button
              disabled={!loggedIn}  // 로그인한 사용자만 새 채팅 가능 → 로그인 안 했으면 버튼 비활성화
              onClick={onNewChat}  // 클릭 시 MainPage의 startNewChat 함수 호출 → 현재 대화 초기화
              className="disabled:opacity-40 flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 채팅
            </button>
          </div>

          {/* 로그인 시 서버 대화 목록, 비로그인 시 안내 문구 */}
          <div className='flex-1 overflow-y-auto'>
            {loggedIn ? (
              conversations.length > 0 ? (
                conversations.map((conv) => (
                  // group: 호버 시 X 버튼이 나타나도록 group-hover 트리거용
                  <div key={conv.conversationId} className="relative group">
                    <button
                      onClick={() => onConversationSelect(conv.conversationId)}
                      className="flex flex-col items-start px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-left w-full pr-7"
                    >
                      <span className="text-sm font-medium text-on-surface truncate w-full">
                        {conv.title}
                      </span>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">
                        {timeAgo(conv.createdAt)}
                      </span>
                    </button>

                    {/* X 버튼: 호버 시에만 표시, 클릭이 대화 선택으로 전파되지 않도록 stopPropagation */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onConversationDelete(conv.conversationId); }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded hover:bg-error/10"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant hover:text-error" style={{ fontSize: '14px' }}>close</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant px-3 py-2">채팅 내역이 없습니다</p>
              )
            ) : (
              <p className="text-xs text-on-surface-variant px-3 py-2">로그인해서 대화를 저장하세요</p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
