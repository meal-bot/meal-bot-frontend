import Navigationbar from '../components/Navigationbar';
import MealCard from '../components/MealCard';
import ChatInput from '../components/ChatInput';
import { useSlider } from '../hooks/useSlider';
import { useChat } from '../hooks/useChat';
import MEAL_DATA from '../data/mealData';

// const localStorageToken = localStorage.getItem('token');

export default function MainPage() {
  const { sliderRef, canScrollLeft, canScrollRight } = useSlider();
  const { query, setQuery, messages, isLoading, hasMessages, messagesEndRef, handleSubmit } = useChat();


  return (
    <div className="text-on-surface selection:bg-primary-container">
      <Navigationbar />

      <main className="pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto transition-all duration-300">
        {/* 헤더 + 슬라이더: 제출 시 부드럽게 사라짐 */}
        <section
          className={`mb-16 transition-all duration-500 ease-in-out overflow-hidden ${hasMessages ? 'opacity-0 max-h-0 mb-0 pointer-events-none' : 'opacity-100 max-h-[1000px]'
            }`}
        >
          {/* 헤더 */}
          <div className="flex flex-col items-center justify-center mb-8">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">
              당신을 위한 추천 식단
            </h2>
            <p className="text-on-surface-variant mt-1">취향과 영양 상태에 맞춘 맞춤 제안</p>
          </div>
          {/* 슬라이더 */}
          <div className="relative group/slider">
            <button
              onClick={() => sliderRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
              disabled={!canScrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:hidden z-20"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <button
              onClick={() => sliderRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
              disabled={!canScrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:hidden z-20"
            >
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </button>
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x"
              style={{
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                maskImage: canScrollLeft && canScrollRight
                  ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                  : canScrollLeft
                    ? 'linear-gradient(to right, transparent, black 10%)'
                    : canScrollRight
                      ? 'linear-gradient(to right, black 90%, transparent)'
                      : 'none',
                WebkitMaskImage: canScrollLeft && canScrollRight
                  ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
                  : canScrollLeft
                    ? 'linear-gradient(to right, transparent, black 10%)'
                    : canScrollRight
                      ? 'linear-gradient(to right, black 90%, transparent)'
                      : 'none',
              }}
            >
              {MEAL_DATA.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        </section>

        {/* 채팅 메시지 영역 */}
        {hasMessages && (
          <section className="max-w-3xl mx-auto flex flex-col gap-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container" style={{ fontSize: '16px' }}>smart_toy</span>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                    ? 'bg-primary text-on-primary rounded-br-sm'
                    : 'bg-surface-container text-on-surface rounded-bl-sm'
                    }`}
                >
                  {msg.role === 'assistant' && isLoading && msg.content === '' ? (
                    <div className="flex items-center gap-1.5 py-1 px-1">
                      <span className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-on-surface-variant/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {msg.content}
                      {msg.isTyping && (
                        <span className="inline-block w-0.5 h-4 bg-current ml-0.5 align-middle animate-pulse" />
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </section>
        )}
      </main>

      <ChatInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
    </div>
  );
}


{/* 모바일 하단 네비게이션 */ }
{/* <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-outline-variant/20 z-50 px-6 py-3 flex justify-around items-center">
        <a href="#" className="flex flex-col items-center gap-1 text-primary">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            restaurant
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tight">키친</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">smart_toy</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">상담</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">프로필</span>
        </a>
      </nav> */}