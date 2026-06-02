import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../../../shared/context/useSidebar';
import MealCard from '../../meal/components/MealCard';
import ChatInput from '../components/ChatInput';
import Layout from '../../../shared/components/layout/Layout';
import RecommendationCards from '../components/RecommendationCards';
import { useSlider } from '../../../shared/hooks/useSlider';
import { useChat } from '../hooks/useChat';
import { isLoggedIn } from '../../auth/utils/auth';
import { fetchRandomRecipes } from '../../meal/api/recipeApi';
import RecipeDetailModal from '../../meal/components/RecipeDetailModal';
export default function MainPage() {
  const { sliderRef, canScrollLeft, canScrollRight } = useSlider();
  const location = useLocation();

  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const { query, setQuery,
          messages, isLoading, hasMessages, messagesEndRef,
          handleSubmit, startNewChat, openExistingChat, chatId,
          chats, refreshChats, deleteChat,
        } = useChat();

  // 사이드바가 열릴 때마다 채팅 목록 갱신 (기존 Sidebar의 useEffect 역할을 MainPage가 담당)
  useEffect(() => {
    if (sidebarOpen && isLoggedIn()) refreshChats();
  }, [sidebarOpen, refreshChats]);

  // 캘린더 등 다른 페이지에서 채팅 클릭 시 해당 채팅 자동 로드
  // ref로 마운트 시점의 state만 캡처 → location 변경에 재반응하지 않음
  const chatIdToOpen = useRef(location.state?.chatIdToOpen);
  useEffect(() => {
    if (chatIdToOpen.current) openExistingChat(chatIdToOpen.current);
  }, [openExistingChat]);

  // 슬라이딩 카드용 레시피 목록 — Spring 연결 전까지 빈 배열 유지 (섹션 미표시)
  const [meals, setMeals] = useState([]);
  // 카드 클릭 시 세팅 → RecipeDetailModal 오픈. null이면 모달 닫힘
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // TODO: Spring GET /api/recipes/random 엔드포인트 구현 후 실제 데이터 표시
  useEffect(() => {
    fetchRandomRecipes(10)
      .then(setMeals)
      .catch(() => {}); // 미연결 시 빈 배열 유지
  }, []);

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
      onStartNewChat={startNewChat}
      chats={chats}
      onOpenExistingChat={openExistingChat}
      onDeleteChat={(chatIdToDelete) => {
        deleteChat(chatIdToDelete);
        if (chatIdToDelete === chatId) startNewChat();  // 현재 채팅 삭제 시 새 채팅으로 초기화
      }}
    >
      {/* 헤더 + 슬라이더: 채팅 시작 시 / 데이터 미로드 시 숨김 */}
      <section
        className={`mb-16 transition-all duration-500 ease-in-out overflow-hidden ${hasMessages || meals.length === 0 ? 'opacity-0 max-h-0 mb-0 pointer-events-none' : 'opacity-100 max-h-[1000px]'}`}
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
            {meals.map((recipe) => (
              <MealCard key={recipe.recipeId} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
            ))}
          </div>
        </div>
      </section>

      {/* 채팅 메시지 영역 */}
      {hasMessages && (
        <section className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.map(msg => {
            const recommendations = msg.recommendations || [];
            return (
              <div key={msg.id} className="flex flex-col gap-2">
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
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
                {recommendations.length > 0 && (
                  <div className="ml-10">
                    <RecommendationCards recommendations={recommendations} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </section>
      )}

      {/* sidebarOpen 전달 → ChatInput이 사이드바 너비에 맞게 위치 조정 */}
      <ChatInput value={query} onChange={setQuery} onSubmit={handleSubmit} sidebarOpen={sidebarOpen} />

      {/* 슬라이딩 카드 클릭 시 상세 모달 — createPortal로 body에 마운트되므로 위치 무관 */}
      <RecipeDetailModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </Layout>
  );
}
