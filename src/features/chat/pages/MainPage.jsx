import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../../../shared/context/useSidebar';
import MealCard from '../../meal/components/MealCard';
import ChatInput from '../components/ChatInput';
import Layout from '../../../shared/components/layout/Layout';
import RecommendationCards from '../components/RecommendationCards';
import { useSlider } from '../../../shared/hooks/useSlider';
import { useChat } from '../hooks/useChat';
import { isLoggedIn } from '../../auth/utils/auth';
import MEAL_DATA from '../../meal/data/mealData';
import { parseRecommendations } from '../utils/parseRecommendations';
// 파이썬 서버에서 구조화된 JSON 대신 마크다운 테이블로 레시피를 보내는 경우를 위한 임시 파싱 함수
// 실제 서버가 JSON을 반환하도록 변경되면 이 파일 전체 삭제 예정
const MOCK_RECOMMENDATIONS = [
  { rank: 1, name: '닭가슴살 샐러드', category: '샐러드', cookingWay: '삶기', description: '구운 고구마와 담백한 닭가슴살로 만든 고단백 샐러드입니다. 구운 고구마와 담백한 닭가슴살로 만든 고단백 샐러드입니다. 구운 고구마와 담백한 닭가슴살로 만든 고단백 샐러드입니다. 구운 고구마와 담백한 닭가슴살로 만든 고단백 샐러드입니다. 구운 고구마와 담백한 닭가슴살로 만든 고단백 샐러드입니다.', },
  { rank: 2, name: '연어 스테이크', category: '생선', cookingWay: '굽기', description: '신선한 연어를 구워낸 담백한 스테이크입니다.', },
  { rank: 3, name: '두부 스크램블', category: '채식', cookingWay: '볶기', description: '부드러운 두부와 야채를 볶아낸 건강한 메뉴입니다.', },
];
export default function MainPage() {
  const { sliderRef, canScrollLeft, canScrollRight } = useSlider();
  const location = useLocation();

  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const { query, setQuery,
          messages, isLoading, hasMessages, messagesEndRef,
          handleSubmit, startChatThread, openChatThread, chatThreadId,
          chatThreads, fetchThreadList, deleteChatThread,
        } = useChat();

  // 사이드바가 열릴 때마다 스레드 목록 갱신 (기존 Sidebar의 useEffect 역할을 MainPage가 담당)
  useEffect(() => {
    if (sidebarOpen && isLoggedIn()) fetchThreadList();
  }, [sidebarOpen, fetchThreadList]);

  // 인바디 등 다른 페이지 사이드바에서 스레드 클릭 시 해당 스레드 자동 로드
  // ref로 마운트 시점의 state만 캡처 → location 변경에 재반응하지 않음
  const incomingThreadId = useRef(location.state?.chatThreadId);
  useEffect(() => {
    if (incomingThreadId.current) openChatThread(incomingThreadId.current);
  }, [openChatThread]);

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
      onChatThreadStart={startChatThread}
      chatThreads={chatThreads}
      onChatThreadSelect={openChatThread}
      onChatThreadDelete={(targetChatThreadId) => {
        deleteChatThread(targetChatThreadId);
        if (targetChatThreadId === chatThreadId) startChatThread();  // 현재 스레드 삭제 시 새 채팅으로 초기화
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
          {messages.map(msg => {
            const parsed = msg.role === 'assistant' && !msg.isTyping && msg.content
              ? parseRecommendations(msg.content)
              : [];
            const recommendations = parsed.length > 0 ? parsed : (msg.role === 'assistant' && !msg.isTyping && msg.content ? MOCK_RECOMMENDATIONS : []);
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
    </Layout>
  );
}
