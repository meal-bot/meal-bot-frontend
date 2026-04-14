import { useRef } from 'react';

export default function ChatInput({ value, onChange, onSubmit }) {
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <section className="fixed bottom-10 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none transition-all duration-300">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl shadow-xl shadow-on-surface/5 rounded-3xl p-2 flex items-center gap-2 border border-outline-variant/30 pointer-events-auto">
        <div className="flex-grow relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="어떤 식단이든 물어보세요... '저탄수화물 식단 추천해줘'"
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 py-4 px-6 text-on-surface placeholder:text-on-surface-variant/40 font-medium resize-none min-h-[56px] max-h-48 overflow-y-auto"
          />
        </div>
        <button
          onClick={onSubmit}
          className="bg-[#C1D8C3] text-on-surface p-3 rounded-2xl flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined">auto_awesome</span>
        </button>
      </div>
    </section>
  );
}
