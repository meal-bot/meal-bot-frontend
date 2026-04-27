import { useState, useEffect } from 'react';
import MealCard from '../components/MealCard';
import ChatInput from '../components/ChatInput';
import Layout from '../components/Layout';
import { useSlider } from '../hooks/useSlider';
import { useChat } from '../hooks/useChat';
import { isLoggedIn } from '../utils/auth';
import MEAL_DATA from '../data/mealData';

export default function MainPage() {
  const { sliderRef, canScrollLeft, canScrollRight } = useSlider();

  // sidebarOpen을 MainPage에서 관리 → Layout과 ChatInput 양쪽에 직접 전달 가능
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { query, setQuery,
          messages, isLoading, hasMessages, messagesEndRef,
          handleSubmit, startChatThread, loadChatThread, chatThreadId,
          chatThreads, loadChatThreads, deleteChatThread,
        } = useChat();

  // 사이드바가 열릴 때마다 스레드 목록 갱신 (기존 Sidebar의 useEffect 역할을 MainPage가 담당)
  useEffect(() => {
    if (sidebarOpen && isLoggedIn()) loadChatThreads();
  }, [sidebarOpen, loadChatThreads]);

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
      onChatThreadStart={startChatThread}
      chatThreads={chatThreads}
      onChatThreadSelect={loadChatThread}
      onChatThreadDelete={(id) => {
        deleteChatThread(id);
        if (id === chatThreadId) startChatThread();  // 현재 스레드 삭제 시 새 채팅으로 초기화
      }}
    >
      {/* 헤더 + 슬라이더: 채팅 시작 시 부드럽게 사라짐 */}
      <section
        className={`mb-16 transition-all duration-500 ease-in-out overflow-hidden ${hasMessages ? 'opacity-0 max-h-0 mb-0 pointer-events-none' : 'opacity-100 max-h-[1000px]'}`}
      >
        <div className="flex flex-col items-center justify-center mb-8">
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">당신을 위한 추천 식단</h2>
          <p className="text-on-surface-variant mt-1">취향과 영양 상태에 맞춘 맞춤 제안</p>
        </div>
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
              {/* assistant 메시지에는 아이콘 표시 */}
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

      {/* sidebarOpen 전달 → ChatInput이 사이드바 너비에 맞게 위치 조정 */}
      <ChatInput value={query} onChange={setQuery} onSubmit={handleSubmit} sidebarOpen={sidebarOpen} />
    </Layout>
  );
}
