import MealCard from '../../meal/components/MealCard';
import { Button, EmptyState } from '../../../shared/components/ui';

export default function ChatIntroSection({
  hasMessages,
  meals,
  isLoading = false,
  errorMessage = '',
  onRetry,
  sliderRef,
  canScrollLeft,
  canScrollRight,
  onSliderScroll,
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
        {isLoading && (
          <p className="py-12 text-center text-sm font-semibold text-on-surface-variant">
            식단 아이디어를 불러오는 중입니다.
          </p>
        )}
        {!isLoading && errorMessage && (
          <EmptyState
            icon="cloud_off"
            title="식단 아이디어를 불러오지 못했습니다"
            description={errorMessage}
            className="mx-auto max-w-xl"
            action={(
              <Button type="button" size="sm" onClick={onRetry}>
                다시 시도
              </Button>
            )}
          />
        )}
        {!isLoading && !errorMessage && meals.length === 0 && (
          <EmptyState
            icon="restaurant"
            title="표시할 식단 아이디어가 없습니다"
            description="잠시 후 다시 시도해 주세요."
            className="mx-auto max-w-xl"
          />
        )}
        {!isLoading && !errorMessage && meals.length > 0 && (
        <div className="relative group/slider">
          <button
            type="button"
            aria-label="이전 식단 보기"
            onClick={() => sliderRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
            disabled={!canScrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:hidden z-20"
          >
            <span className="material-symbols-outlined" aria-hidden="true">arrow_back_ios_new</span>
          </button>
          <button
            type="button"
            aria-label="다음 식단 보기"
            onClick={() => sliderRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
            disabled={!canScrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:hidden z-20"
          >
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward_ios</span>
          </button>
          <div
            ref={sliderRef}
            onScroll={onSliderScroll}
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
        )}
      </div>
    </section>
  );
}
