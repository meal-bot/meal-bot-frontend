import TEMP_HISTORY from '../data/historyData';


// isOpen: 사이드바 열림 여부 (Layout에서 관리)
// onToggle: 토글 버튼 클릭 시 Layout의 상태를 변경하는 콜백
export default function Sidebar({ isOpen, onToggle }) {

  return (
    // isOpen 여부에 따라 너비와 패딩을 전환 (transition으로 부드럽게 접힘)
    // z-index는 index.css의 --z-sidebar 변수로 중앙 관리
    <aside style={{ zIndex: 'var(--z-sidebar)' }} className={`fixed left-0 top-0 h-screen border-r border-outline-variant/30 bg-gray-50/80 backdrop-blur-sm flex flex-col py-4 gap-1 transition-all duration-300 ${isOpen ? 'w-60 px-3' : 'w-10.5 px-1'}`}>
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
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-2">채팅 내역</p>
          {TEMP_HISTORY.map((item) => (
            <button
              key={item.id}
              className="flex flex-col items-start px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-left w-full"
            >
              <span className="text-sm font-medium text-on-surface truncate w-full">{item.title}</span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">{item.date}</span>
            </button>
          ))}
          {/* 새 채팅 버튼은 항상 사이드바 하단에 고정 */}
          <div className="mt-auto">
            <button className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl hover:bg-surface-container transition-colors text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-base">add</span>
              새 채팅
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
