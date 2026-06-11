import MealCard from '../../meal/components/MealCard';

export default function ChatIntroSection({
  hasMessages,
  meals,
  sliderRef,
  canScrollLeft,
  canScrollRight,
  onMealClick,
}) {
  const maskImage = canScrollLeft && canScrollRight
    ? 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
    : canScrollLeft
      ? 'linear-gradient(to right, transparent, black 10%)'
      : canScrollRight
        ? 'linear-gradient(to right, black 90%, transparent)'
        : 'none';

  return (
    <section
      className={`chat-intro-section ${hasMessages ? 'is-hidden pointer-events-none' : ''}`}
    >
      <div className="chat-intro-content">
        <div className="flex flex-col items-center justify-center mb-8">
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">대화 전에 먼저 둘러보세요</h2>
          <p className="text-on-surface-variant mt-1">OBOB이 준비한 식단 아이디어를 가볍게 확인해보세요.</p>
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
              maskImage,
              WebkitMaskImage: maskImage,
            }}
        >
            {meals.map((meal) => (
              <MealCard
                key={meal.recipeId || meal.id}
                meal={meal}
                onClick={() => onMealClick(meal)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
