import { useRef, useEffect } from 'react';
import { Button } from '../../../shared/components/ui';
//import { useConversations } from '../hooks/useConversations';

export default function ChatInput({
  value,
  onChange,
  onSubmit,
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
    <div className="w-full max-w-3xl bg-white/95 backdrop-blur-xl shadow-lg shadow-on-surface/5 rounded-2xl p-2 flex items-center gap-2 border border-outline-variant/40 outline outline-1 outline-blue-400 pointer-events-auto">
      <div className="flex-grow relative flex items-center">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onCompositionStart={handleCompositionStart}
          onKeyDown={handleKeyDown}
          placeholder="어떤 식단이든 물어보세요... '저탄수화물 식단 추천해줘'"
          rows={1}
          className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 sm:px-5 text-on-surface placeholder:text-on-surface-variant/40 font-medium leading-6 resize-none min-h-[52px] max-h-48 overflow-y-auto"
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
  );
}
