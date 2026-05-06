const COOKING_ICONS = {
  '굽기': 'outdoor_grill',
  '찌기': 'soup_kitchen',
  '볶기': 'skillet',
  '기타': 'restaurant',
};

export default function RecommendationCards({ recommendations }) {
  if (!recommendations?.length) return null;

  return (
    <div className="flex flex-col gap-2 mt-3 w-full">
      {recommendations.map(rec => (
        <div
          key={rec.rank}
          className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm flex items-center gap-4 overflow-hidden"
        >
          {/* 이미지 영역 — 추후 rec.imageUrl로 교체 */}
          <div className="w-20 h-20 flex-shrink-0 bg-surface-container flex items-center justify-center relative">
            {rec.imageUrl
              ? <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover" />
              : <span className="material-symbols-outlined text-outline-variant text-3xl">image</span>
            }
            <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-extrabold flex items-center justify-center">
              {rec.rank}
            </span>
          </div>

          <div className="flex-1 py-3 pr-4 flex flex-col gap-1.5 min-w-0">
            <span className="text-sm font-bold text-on-surface leading-snug truncate">
              {rec.name}
            </span>
            <div className="flex items-center gap-2">
              {rec.category && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-container text-primary">
                  {rec.category}
                </span>
              )}
              {rec.cookingWay && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                    {COOKING_ICONS[rec.cookingWay] ?? 'restaurant'}
                  </span>
                  {rec.cookingWay}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
