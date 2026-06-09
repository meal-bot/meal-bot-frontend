import { useState } from 'react';
import { EmptyState, IconButton } from '../../../shared/components/ui';
import { timeAgo } from '../../../shared/utils/timeAgo';
import { isLoggedIn } from '../../auth/utils/auth';

// isOpen              : 사이드바 열림 여부 (Layout에서 관리)
// onToggle            : 토글 버튼 클릭 시 사이드바 상태 반전 콜백
// onStartNewChat      : 새 채팅 버튼 클릭 시 현재 채팅 초기화 (ChatPage → Layout → Sidebar)
// chats               : 채팅 목록 (useChat을 ChatPage로 올려 props로 전달받음)
// onOpenExistingChat  : 채팅 클릭 시 해당 채팅 불러오기 (ChatPage → Layout → Sidebar)
// onDeleteChat        : X 버튼 클릭 시 해당 채팅 삭제 (ChatPage → Layout → Sidebar)
export default function ChatSidebar({ isOpen, onToggle, onStartNewChat, chats, onOpenExistingChat, onDeleteChat }) {
  const loggedIn = isLoggedIn();
  // [codex] 삭제 확인 중인 항목도 백엔드 Chat 식별자인 chatId를 그대로 사용한다.
  const [chatIdPendingDelete, setChatIdPendingDelete] = useState(null);

  return (
    <>
      {/* 모바일 backdrop: 사이드바 열릴 때 배경 어둡게, 클릭 시 닫힘 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          style={{ zIndex: 'var(--z-sidebar)' }}
          onClick={onToggle}
        />
      )}
    <aside
      style={{ zIndex: 'calc(var(--z-sidebar) + 1)' }}
      className={`fixed left-0 top-0 h-screen border-r border-outline-variant/30 bg-gray-100/80
      backdrop-blur-sm flex flex-col py-4 gap-1 transition-all duration-300 ${isOpen ? 'w-60 px-3' : 'w-0 md:w-10.5 px-0 md:px-1 overflow-hidden'}`}
    >
      {/* 토글 버튼: 열림이면 menu_open, 닫힘이면 menu 아이콘 */}
      <IconButton
        icon={isOpen ? 'menu_open' : 'menu'}
        label={isOpen ? '사이드바 닫기' : '사이드바 열기'}
        size="iconSm"
        onClick={onToggle}
        className="self-end mb-1 rounded-lg"
        iconClassName="text-base text-on-surface-variant"
      />

      {/* 사이드바가 열린 경우에만 내용 렌더링 */}
      {isOpen && (
        <>
          <p className="text-[14px] font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-2">
            대화 내역
          </p>

          {/* 새 채팅 버튼 */}
          <div>
            {/* 임시: 게스트도 새 채팅 허용 (원복 시 disabled={!loggedIn} 추가, className에 disabled:opacity-40 추가) */}
            <button
              onClick={onStartNewChat}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-base">add</span>
              새 채팅
            </button>
          </div>

          {/* 로그인 시 채팅 목록, 비로그인 시 안내 문구 */}
          <div className='flex-1 overflow-y-auto'>
            {loggedIn ? (
              chats.length > 0 ? (
                chats.map((chat) => {
                  const isPending = chatIdPendingDelete === chat.chatId;
                  return (
                    // group: 호버 시 X 버튼이 나타나도록 group-hover 트리거용
                    <div key={chat.chatId} className="relative group">
                      {isPending ? (
                        // 삭제 확인 상태: 제목 대신 확인/취소 버튼 표시
                        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-error/5">
                          <span className="text-xs text-error font-medium">삭제할까요?</span>
                          <div className="flex gap-1">
                            <IconButton
                              icon="check"
                              label="삭제 확인"
                              size="iconXs"
                              onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.chatId); setChatIdPendingDelete(null); }}
                              className="rounded hover:bg-error/20"
                              iconClassName="text-error text-sm"
                            />
                            <IconButton
                              icon="close"
                              label="삭제 취소"
                              size="iconXs"
                              onClick={(e) => { e.stopPropagation(); setChatIdPendingDelete(null); }}
                              className="rounded"
                              iconClassName="text-on-surface-variant text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onOpenExistingChat(chat.chatId)}
                            className="flex flex-col items-start px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-left w-full pr-7"
                          >
                            <span className="text-sm font-medium text-on-surface truncate w-full">
                              {chat.title}
                            </span>
                            <span className="text-[11px] text-on-surface-variant mt-0.5">
                              {timeAgo(chat.createdAt)}
                            </span>
                          </button>

                          {/* X 버튼: 호버 시에만 표시, 클릭 시 삭제 확인 상태로 전환
                              stopPropagation: 클릭 이벤트가 부모(채팅 선택 버튼)로 전파되는 것을 막음 */}
                          <IconButton
                            icon="close"
                            label="대화 삭제"
                            size="iconXs"
                            onClick={(e) => { e.stopPropagation(); setChatIdPendingDelete(chat.chatId); }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-error/10"
                            iconClassName="text-on-surface-variant hover:text-error text-sm"
                          />
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <SidebarEmptyState />
              )
            ) : (
              // 임시: 로그인 유도 문구 숨김
              // <p className="text-xs text-on-surface-variant px-3 py-2">로그인해서 대화를 저장하세요</p>
              <SidebarEmptyState />
            )}
          </div>
        </>
      )}
    </aside>
    </>
  );
}

function SidebarEmptyState() {
  return (
    <EmptyState
      icon="forum"
      title="채팅 내역이 없습니다"
      className="mx-1 mt-2 px-3 py-6 bg-transparent border-0"
    />
  );
}
