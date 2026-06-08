import { useRef, useEffect } from 'react';
import { Button, FloatingActionButton } from '../../../shared/components/ui';
//import { useConversations } from '../hooks/useConversations';

// sidebarOpen: 사이드바 열림 여부 → left 값을 조정해 사이드바와 겹치지 않게 위치 이동
export default function ChatInput({
  value,
  onChange,
  onSubmit,
  sidebarOpen = false,
  showScrollButton = false,
  onScrollToBottom,
}) {
  const textareaRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  //const { conversations, loadConversations } = useConversations(onSubmit);

  useEffect(() => {
    if (!value && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value]);

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    onChange(e.target.value);
  };

  const handleCompositionStart = () => {
    hasSubmittedRef.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      if (hasSubmittedRef.current) {
        e.preventDefault();
        return;
      }
      hasSubmittedRef.current = true;
      setTimeout(() => { hasSubmittedRef.current = false; }, 0);
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <section className={`fixed bottom-6 md:bottom-10 right-0 left-0 flex flex-col items-center px-4 md:px-6 z-50 pointer-events-none transition-all duration-300 ${sidebarOpen ? 'md:left-60' : 'md:left-12'}`}>
      {showScrollButton && (
        <FloatingActionButton
          icon="keyboard_arrow_down"
          label="최신 메시지"
          onClick={onScrollToBottom}
          className="mb-3"
        />
      )}
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-xl shadow-lg shadow-on-surface/5 rounded-2xl p-2 flex items-center gap-2 border border-outline-variant/40 pointer-events-auto">
        <div className="flex-grow relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onCompositionStart={handleCompositionStart}
            onKeyDown={handleKeyDown}
            placeholder="어떤 식단이든 물어보세요... '저탄수화물 식단 추천해줘'"
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 py-3.5 px-4 sm:px-5 text-on-surface placeholder:text-on-surface-variant/40 font-medium resize-none min-h-[52px] max-h-48 overflow-y-auto"
          />
        </div>
        <Button
          onClick={onSubmit}
          variant="secondary"
          size="icon"
          className="shrink-0 bg-primary text-white hover:opacity-90"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
        </Button>
      </div>
    </section>
  );
}
