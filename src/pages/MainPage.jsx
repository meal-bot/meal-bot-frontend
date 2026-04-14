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
  const [query, setQuery] = useState('');
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
    return () => {
      el.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, [updateButtons]);

  // const handleSubmit = () => {
  //   if (!query.trim()) return;
  //   // TODO: 백엔드 연결
  //   console.log('전송:', query);
  //   setQuery('');


  //////////  axios 코드 ////////////////////////////////
  const [aiReply, setAiReply] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setHasSubmitted(true);
    setIsLoading(true);
    setAiReply('');

    try {
      const result = await sendChatQuery(query);
      setAiReply(result.reply || "전송 했습니다.");
      setQuery('');
    } catch (error) {
      console.log("서버 미연결 상태 - 테스트 메시지 출력");
      setAiReply("**임시 답변**. (서버 연결 대기 중)");
      setQuery('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-on-surface selection:bg-primary-container">
      <Navigationbar />

      <main className="pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto transition-all duration-300">
        {/* 헤더 + 슬라이더: 제출 시 부드럽게 사라짐 */}
        <section
          className={`mb-16 transition-all duration-500 ease-in-out overflow-hidden ${
            hasSubmitted ? 'opacity-0 max-h-0 mb-0 pointer-events-none' : 'opacity-100 max-h-[1000px]'
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
              className="absolute left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:hidden z-20"
            >
              <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <button
              onClick={() => sliderRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
              disabled={!canScrollRight}
              className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:hidden z-20"
            >
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </button>
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {MEAL_DATA.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          </div>
        </section>

        {/* AI 답변 영역: 제출 후 부드럽게 나타남 */}
        <section
          className={`mb-16 transition-all duration-500 ease-in-out ${
            hasSubmitted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="max-w-3xl mx-auto bg-primary-container/50 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-bold text-on-surface mb-2">AI의 답변:</h3>
            {isLoading ? (
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                <span>답변 생성 중...</span>
              </div>
            ) : (
              <p className="text-on-surface-variant">{aiReply}</p>
            )}
          </div>
        </section>
        
      </main>

      <ChatInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
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
    </div>
  );
}
