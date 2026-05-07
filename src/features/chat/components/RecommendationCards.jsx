import { Card } from '../../../shared/components/ui';

const COOKING_ICONS = {
  '굽기': 'outdoor_grill',
  '찌기': 'soup_kitchen',
  '볶기': 'skillet',
  '기타': 'restaurant',
};

export default function RecommendationCards({ recommendations }) {
  if (!recommendations?.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-3 w-full">
      {recommendations.slice(0, 2).map(rec => (
        <Card
          as="article"
          padding="none"
          key={rec.rank}
          className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* 이미지 영역 */}
          <div className="h-56 bg-surface-container flex items-center justify-center relative">
            {rec.imageUrl
              ? <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover" />
              : <span className="material-symbols-outlined text-outline-variant text-4xl">image</span>
            }
            <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">
              {rec.rank}
            </span>
          </div>

          {/* 텍스트 영역 */}
          <div className="p-3 flex flex-col gap-2 flex-1">
            <span className="text-sm font-bold text-on-surface leading-snug line-clamp-2">
              {rec.name}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {rec.category && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-container text-primary">
                  {rec.category}
                </span>
              )}
              {rec.cookingWay && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                    {COOKING_ICONS[rec.cookingWay] ?? 'restaurant'}
                  </span>
                  {rec.cookingWay}
                </span>
              )}
            </div>
            {rec.description && (
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-3 mt-0.5">
                {rec.description}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
