import { useState, useRef, useEffect, useCallback } from 'react';
import Navigationbar from '../components/Navigationbar';
import MealCard from '../components/MealCard';
import ChatInput from '../components/ChatInput';
import { sendChatQuery } from '../api/chatService'; // 1. API 함수 불러오기

// 임시 데이터 - 실제로는 백엔드에서 받아올 예정
const MEAL_DATA = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-FI0VRVcMJvCmzZUZ8eZbXJXlg7s_uNIKNyDkl2SWDnlbp3vmaoyb4sX-4OyBLyOzJzvPIgiVvi_9vsdzA-o1ChAdGtygnd3Lrqp2YH9wMCJ20S-GikCyKDdWkCF5EU2AMDNZQak505V3XzJa2j4jXS5vTPGfN9Jb7dL0qQIApSVzJFpFpuNVVJQnZEDHhLuGftHAv7fuOwtyisRfY4fsWrhRGera0XNW51fPObLhkcF4mYYFns4-3sjaFFFvRHHC839YKNMmGnuB',
    alt: 'Salad',
    tagText: '가벼운 점심',
    tagColor: 'text-secondary',
    title: '지중해식 병아리콩 샐러드',
    time: '15분',
    calories: '320kcal',
  },
  {
    id: 2,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMEbb1gt3iFyg7KOXe3Bj6YlWt3fx8YwKOqA8qk70ho64j2Tfzl29io_-JF1BDdQfxosaBMKwirrtz4CZYSQ8vN2yBvwhOg-_ivYBs-Zh7oA1_huF_o92lmFO37rtrQymoe5kEafgGjumyDnqxwlVXVq4rzlDDRGklzmVCtmzBCnBO7IAKwPgoCGUTULflXEGH-ytIHhX1Kf72JCVz-rpUOE04TH5Zh3QQAmxU26F-D9oph3RCSysbjJceF2QvHWKV636N5FDPxxDG',
    alt: 'Bowl',
    tagText: '단백질 강화',
    tagColor: 'text-primary',
    title: '연어와 아보카도 포케볼',
    time: '20분',
    calories: '450kcal',
  },
  {
    id: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_d1pzuJayCgdW-XNO3CkWoqwoUZZNW-B8uuT5lMkJlcH5ZnFis6NWcjyvVjqy8I-iwPWzwG3BKUL3daeu851EeehzAfk3ArlqMTtDwLiEZoLozp8K7meDvk7vBHt5GxIuJBtwpnYFvmgRCLoI1NngqGYvIwu3XpVCp-oFjJaHYeHq91jfJXLmSKBohL3uJ4Lj9_zI46UUTN8bx8HmOgtfN2gDVoz5BuTuZNYNKiEf14CpvndJbOEeMeJfJbHW5t76Gwf2ojCZP1Mv',
    alt: 'Veggie',
    tagText: '비건 선택',
    tagColor: 'text-tertiary',
    title: '그릴드 베지터블 타코',
    time: '25분',
    calories: '280kcal',
  },
  {
    id: 4,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIFW0IFjiNp-gwDHCNLBnUrhaUqAWQ6UOdE7gq0uzzgmF_xxabRl9pl8zsmOzSeLbIVmSe_ax4Wl4tNCMixDzQlNRxZRYLwOyY3M2-0F7-7aP8EXczWHtQ597-1sK2rLvMFJEBSFUTG-KkW1p1qGpYrG4NcaHbqSqg6iPHA19jABXhksCk3hv_qYJ6uZULG6mXHqgDDSlsCOWhdworZ_4CGixHpCdRJqBqx4r4okk4bH3Mtw_h7U4eYM4Ft97_-1Lc-n81BEjXjkB-',
    alt: 'Soup',
    tagText: '디톡스',
    tagColor: 'text-secondary',
    title: '펌킨 시나몬 스프',
    time: '30분',
    calories: '190kcal',
  },
  {
    id: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsuzFrwMihT6wWohlwRB-VkSRyRr4pZLOIuJyTN0U1t8o7se9-GFdoew86ftTbD02cAGQly9rXlBrOe6NgBZNsFTw0JEgk6OyDQn1mZfbpXbxDN_8H4t1K-7DMKbJQDxa-nFFk_MdXxrma_WhHzIE3bdyhFivI5QNPDXaPtQqjJZCjillgu0f2ABO6oCcKW8Yfy-bzlk1LHH6VauRKToRN-ni_jQvFjO_ilfyPAQi4qn3UOyFUddAu5tjZ4V1bOcif3molW2EBJwJB',
    alt: 'Green Power Bowl',
    tagText: '항산화 효과',
    tagColor: 'text-primary',
    title: '그린 파워 보울',
    time: '18분',
    calories: '290kcal',
  },
  {
    id: 6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmLyBc_soCaGl47qwcOjGf3aECIchfG3nG9gOA01obLp6aWMTEW4YcyBWitj7KH7M0lMmtVP7Y_5zugUPo92BPlqCMwSwZCa_HMcENHF83bX8Dqa7k1lJaDBgNDw2H5A7ZGoWVFFvZmQkTo6nlRCIqT0FW57B92DQFdT77oOsLfIombnZm3ERp0atnnQS0VYnEF4Lvgl4gu2RZTb5J6e0feXbZV2aJGT33ZxHwAWXXr8cHg8Gl58OA9NOJ0kWyJZCNznbFM4g5hFmm',
    alt: 'Sweet Potato Chicken Salad',
    tagText: '고단백 식단',
    tagColor: 'text-secondary',
    title: '고구마 닭가슴살 샐러드',
    time: '22분',
    calories: '410kcal',
  },
  {
    id: 7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_kU2clE9BSpmBQhkxm1P5e2wi8GPsFEyDvWjU7kNrWjD8wWs_zs5V1VacAJZ5aH06x8-VKWXvSqFkncCPGRiDSdbFJ8iexC-iOx40oET9ZNP3VkLLKCU8DEibfvpF9OGz8t3M-bWfWOKGv9L9SHmrZ6R84KHTu8HN2KTfBJt0CJqZMsfDEEgfuT9I6I0ow5a5xJdG90gpeKK-7WigEsDPoyVsOSCOWD5KZ_zxwPalgK5-G9xrX-t92LMiZWYSpNoziZlthHGiQjVU',
    alt: 'Avocado Toast',
    tagText: '건강한 지방',
    tagColor: 'text-tertiary',
    title: '아보카도 토스트',
    time: '12분',
    calories: '350kcal',
  },
];

export default function MainPage() {
  // 채팅 입력창의 텍스트 값
  const [query, setQuery] = useState('');

  // *** 슬라이더 좌우 스크롤 관련 ***
  const sliderRef = useRef(null);           // 슬라이더 DOM 요소 참조
  const [canScrollLeft, setCanScrollLeft] = useState(false);   // 왼쪽 화살표 버튼 활성화 여부
  const [canScrollRight, setCanScrollRight] = useState(true);  // 오른쪽 화살표 버튼 활성화 여부

  // 현재 스크롤 위치를 기반으로 좌우 버튼 활성화 상태 갱신
  const updateButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    // 왼쪽으로 5px 이상 스크롤됐으면 왼쪽 버튼 활성화
    setCanScrollLeft(el.scrollLeft > 5);
    // 오른쪽 끝에 도달하지 않았으면 오른쪽 버튼 활성화
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  // ***슬라이더 스크롤 이벤트 및 창 리사이즈 이벤트 등록 (언마운트 시 정리)***
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons(); // 초기 상태 한 번 체크
    return () => {
      el.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, [updateButtons]);


  // ***채팅 메시지 관련 ***
  const [messages, setMessages] = useState([]);       // 전체 메시지 목록
  const [isLoading, setIsLoading] = useState(false);  // AI 응답 대기 중 여부
  const messagesEndRef = useRef(null);                // 메시지 목록 맨 아래 DOM 참조 (자동 스크롤용)
  const typingIntervalRef = useRef(null);             // 타이핑 애니메이션 인터벌 참조

  // 메시지가 하나라도 있으면 true (헤더/슬라이더 숨김 여부 결정에 사용)
  const hasMessages = messages.length > 0;

  // 컴포넌트 언마운트 시 진행 중인 타이핑 인터벌 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ***한 글자씩 출력하는 타이핑 애니메이션***
  // fullText: 전체 응답 텍스트, messageId: 업데이트할 메시지 ID
  const typeMessage = useCallback((fullText, messageId) => {
    // 이전 타이핑 인터벌이 있으면 취소
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    let index = 0;
    // 20ms마다 글자 하나씩 추가
    typingIntervalRef.current = setInterval(() => {
      index++;
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            // 해당 메시지의 content를 index만큼 잘라서 업데이트, 타이핑 완료 여부도 함께 갱신
            ? { ...msg, content: fullText.slice(0, index), isTyping: index < fullText.length }
            : msg
        )
      );
      // 모든 글자를 다 출력하면 인터벌 종료
      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    }, 40);
  }, []);

  // ***채팅 axios 전송 핸들러***
  const handleSubmit = async () => {
    // 빈 입력이거나 이미 로딩 중이면 무시
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const userMsgId = Date.now();         // 사용자 메시지 ID (타임스탬프)
    const assistantMsgId = userMsgId + 1; // AI 메시지 ID (사용자 ID + 1로 고유성 보장)

    // 사용자 메시지와 빈 AI 메시지 자리를 미리 추가
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: currentQuery },
      { id: assistantMsgId, role: 'assistant', content: '', isTyping: false },
    ]);
    setQuery('');       // 입력창 초기화
    setIsLoading(true); // 로딩 상태 시작 (점 3개 애니메이션 표시)

    try {
      const result = await sendChatQuery(currentQuery);
      const fullReply = result.reply || '전송 했습니다.';
      setIsLoading(false);
      typeMessage(fullReply, assistantMsgId); // 응답을 타이핑 애니메이션으로 출력
    } catch {
      // 서버 오류 시 fallback 메시지를 타이핑 애니메이션으로 출력
      const fallback = '임시 답변입니다. (서버 연결 대기 중)';
      setIsLoading(false);
      typeMessage(fallback, assistantMsgId);
    }
  };


  return (
    <div className="text-on-surface selection:bg-primary-container">
      <Navigationbar />

      <main className="pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto transition-all duration-300">
        {/* 헤더 + 슬라이더: 제출 시 부드럽게 사라짐 */}
        <section
          className={`mb-16 transition-all duration-500 ease-in-out overflow-hidden ${
            hasMessages ? 'opacity-0 max-h-0 mb-0 pointer-events-none' : 'opacity-100 max-h-[1000px]'
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
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
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


      {/* 모바일 하단 네비게이션 */}
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