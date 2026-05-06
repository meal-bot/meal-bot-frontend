import { useState } from 'react';
import { timeAgo } from '../../../shared/utils/timeAgo';
import { isLoggedIn } from '../../auth/utils/auth';

// isOpen              : 사이드바 열림 여부 (Layout에서 관리)
// onToggle            : 토글 버튼 클릭 시 사이드바 상태 반전 콜백
// onChatThreadStart   : 새 채팅 버튼 클릭 시 현재 스레드 초기화 (MainPage → Layout → Sidebar)
// chatThreads         : 채팅 스레드 목록 (useChatThreads를 MainPage로 올려 props로 전달받음)
// onChatThreadSelect  : 스레드 클릭 시 해당 스레드 불러오기 (MainPage → Layout → Sidebar)
// onChatThreadDelete  : X 버튼 클릭 시 해당 스레드 삭제 (MainPage → Layout → Sidebar)
export default function ChatSidebar({ isOpen, onToggle, onChatThreadStart, chatThreads, onChatThreadSelect, onChatThreadDelete }) {
  const loggedIn = isLoggedIn();
  // 삭제 확인 대기 중인 스레드 ID (null이면 대기 없음)
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

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

          {/* 새 채팅 버튼 */}
          <div>
            <button
              disabled={!loggedIn}  // 로그인한 사용자만 새 채팅 가능
              onClick={onChatThreadStart}
              className="disabled:opacity-40 flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 채팅
            </button>
          </div>

          {/* 로그인 시 스레드 목록, 비로그인 시 안내 문구 */}
          <div className='flex-1 overflow-y-auto'>
            {loggedIn ? (
              chatThreads.length > 0 ? (
                chatThreads.map((thread) => {
                  const isPending = pendingDeleteId === thread.chatThreadId;
                  return (
                    // group: 호버 시 X 버튼이 나타나도록 group-hover 트리거용
                    <div key={thread.chatThreadId} className="relative group">
                      {isPending ? (
                        // 삭제 확인 상태: 제목 대신 확인/취소 버튼 표시
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-error/5">
                          <span className="text-xs text-error font-medium">삭제할까요?</span>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); onChatThreadDelete(thread.chatThreadId); setPendingDeleteId(null); }}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-error/20 transition-colors"
                            >
                              <span className="material-symbols-outlined text-error" style={{ fontSize: '14px' }}>check</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setPendingDeleteId(null); }}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container transition-colors"
                            >
                              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '14px' }}>close</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onChatThreadSelect(thread.chatThreadId)}
                            className="flex flex-col items-start px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-left w-full pr-7"
                          >
                            <span className="text-sm font-medium text-on-surface truncate w-full">
                              {thread.title}
                            </span>
                            <span className="text-[11px] text-on-surface-variant mt-0.5">
                              {timeAgo(thread.createdAt)}
                            </span>
                          </button>

                          {/* X 버튼: 호버 시에만 표시, 클릭 시 삭제 확인 상태로 전환
                              stopPropagation: 클릭 이벤트가 부모(스레드 선택 버튼)로 전파되는 것을 막음 */}
                          <button
                            onClick={(e) => { e.stopPropagation(); setPendingDeleteId(thread.chatThreadId); }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded hover:bg-error/10"
                          >
                            <span className="material-symbols-outlined text-on-surface-variant hover:text-error" style={{ fontSize: '14px' }}>close</span>
                          </button>
                        </>
                      )}
                    </div>
                  );
                })
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
