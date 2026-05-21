import { Card } from '../../../shared/components/ui';

export default function RecommendationCards({ recommendations }) {
  if (!recommendations?.length) return null;

  return (
    <div className={`grid gap-3 mt-3 w-full ${recommendations.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {recommendations.slice(0, 2).map((rec, index) => (
        <Card
          as="article"
          padding="none"
          key={rec.recipeId}
          className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* 순서 뱃지 + 제목 영역 */}
          <div className="p-3 flex flex-col gap-2 flex-1">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm font-bold text-on-surface leading-snug line-clamp-2">
                {rec.name}
              </span>
            </div>

            {/* 주재료 + 조리시간 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {rec.mainIngredients?.slice(0, 2).map((ingredient, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-container text-primary">
                  {ingredient}
                </span>
              ))}
              {rec.cookingTime && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>timer</span>
                  {rec.cookingTime}분
                </span>
              )}
            </div>

            {/* 요약 */}
            {rec.summary && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2 mt-0.5">
                {rec.summary}
              </p>
            )}

            {/* 추천 이유 */}
            {rec.reason && (
              <p className="text-[11px] text-primary leading-relaxed line-clamp-2 mt-0.5">
                {rec.reason}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}