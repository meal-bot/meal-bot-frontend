import { createPortal } from 'react-dom';
import { Card } from '../../../shared/components/ui';

export default function RecipeDetailModal({ recipe, isLoading = false, error = '', onRetry, onClose }) {
  if (!recipe) return null;

  const {
    name,
    summary,
    category,
    mainIngredients,
    tasteTags,
    dishTypeTags,
    cookingTime,
    difficulty,
    spicyLevel,
    nutrition,
    ingredientsStructured,
    manuals,
    imgMain,
    imgThumb,
  } = recipe;

  const canShowDetail = !isLoading && !error;
  const heroImage = imgMain || imgThumb;
  const fallbackHeroImage = imgThumb;
  const handleHeroImageError = (event) => {
    console.error('[RecipeDetailModal] 상단 이미지 로드 실패:', event.currentTarget.currentSrc || heroImage);

    if (fallbackHeroImage && event.currentTarget.dataset.fallbackApplied !== 'true') {
      event.currentTarget.dataset.fallbackApplied = 'true';
      event.currentTarget.src = fallbackHeroImage;
      return;
    }

    event.currentTarget.style.display = 'none';
  };
  const detailTags = [...(tasteTags || []), ...(dishTypeTags || [])].filter(Boolean);

  const NUTRITION_LABELS = [
    { key: 'energyKcal', label: '칼로리', unit: 'kcal', color: 'bg-primary-container text-primary' },
    { key: 'proteinG', label: '단백질', unit: 'g', color: 'bg-tertiary-container text-tertiary' },
    { key: 'carbsG', label: '탄수화물', unit: 'g', color: 'bg-secondary-container text-secondary' },
    { key: 'fatG', label: '지방', unit: 'g', color: 'bg-error-container text-error' },
    { key: 'sodiumMg', label: '나트륨', unit: 'mg', color: 'bg-surface-container text-on-surface-variant' },
  ];

  const INGREDIENT_SECTIONS = [
    { key: 'main', label: '주재료' },
    { key: 'sauce', label: '양념' },
    { key: 'garnish', label: '고명' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* 백드롭: 클릭으로 닫히지 않음 (X 버튼만으로 닫기) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <Card as="div" padding="none" className="relative w-full max-w-2xl h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* 헤더: 제목 + X 버튼 */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md border-b border-outline-variant/20 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-xl font-extrabold text-on-surface tracking-tight">{name}</h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {mainIngredients?.map((ingredient, i) => (
                <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-container text-primary">
                  {ingredient}
                </span>
              ))}
              {cookingTime && (
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timer</span>
                  {cookingTime}분
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '22px' }}>close</span>
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {isLoading && (
            <div className="flex items-center gap-2 rounded-xl bg-surface-container px-4 py-3 text-sm font-bold text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
              레시피 상세 정보를 불러오는 중입니다
            </div>
          )}

          {error && (
            <div className="flex flex-col gap-3 rounded-xl bg-error-container px-4 py-3 text-error">
              <p className="text-sm font-bold">{error}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="self-start rounded-lg bg-white/70 px-3 py-1.5 text-xs font-extrabold hover:bg-white transition-colors"
                >
                  다시 시도
                </button>
              )}
            </div>
          )}

          {canShowDetail && (
            heroImage ? (
              <div className="h-64 w-full rounded-xl bg-surface-container overflow-hidden flex items-center justify-center">
                <img
                  src={heroImage}
                  alt={name}
                  onLoad={(event) => {
                    console.log('[RecipeDetailModal] 상단 이미지 로드 완료:', event.currentTarget.currentSrc || heroImage);
                  }}
                  onError={handleHeroImageError}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-40 w-full rounded-xl bg-surface-container flex items-center justify-center text-sm font-bold text-on-surface-variant">
                레시피 이미지가 없습니다
              </div>
            )
          )}

          {canShowDetail && summary && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-on-surface-variant leading-relaxed">{summary}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {category && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {category}
                  </span>
                )}
                {difficulty && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    {difficulty}
                  </span>
                )}
                {spicyLevel != null && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                    매운맛 {spicyLevel}
                  </span>
                )}
                {detailTags.map((tag, i) => (
                  <span key={`${tag}-${i}`} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-container text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 영양 정보 */}
          {canShowDetail && nutrition && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-extrabold text-on-surface tracking-tight">영양 정보</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {NUTRITION_LABELS.map(({ key, label, unit, color }) => (
                  nutrition[key] != null && (
                    <div key={key} className={`rounded-xl px-3 py-2.5 ${color}`}>
                      <p className="text-[11px] font-bold opacity-80">{label}</p>
                      <p className="text-base font-extrabold mt-0.5">
                        {nutrition[key]}<span className="text-[11px] font-bold ml-0.5">{unit}</span>
                      </p>
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* 식재료 */}
          {canShowDetail && ingredientsStructured && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-extrabold text-on-surface tracking-tight">식재료</h3>
              <div className="flex flex-col gap-4">
                {INGREDIENT_SECTIONS.map(({ key, label }) => {
                  const items = ingredientsStructured[key] || [];
                  if (items.length === 0) return null;

                  return (
                    <div key={key} className="flex flex-col gap-1.5">
                      <h4 className="text-xs font-extrabold text-primary">{label}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {items.map((ing, i) => (
                          <div key={`${ing.name}-${i}`} className="flex justify-between gap-3 items-baseline border-b border-outline-variant/20 py-1.5">
                            <span className="text-sm text-on-surface">{ing.name}</span>
                            <span className="text-xs font-medium text-on-surface-variant text-right">
                              {ing.amount}{ing.note ? ` (${ing.note})` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 조리법 */}
          {canShowDetail && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-extrabold text-on-surface tracking-tight">조리법</h3>
              {manuals?.length > 0 ? (
                <ol className="flex flex-col gap-4">
                  {manuals.map((manual, i) => (
                    <li key={manual.step || i} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {manual.step || i + 1}
                      </span>
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="text-sm text-on-surface leading-relaxed">{manual.desc}</p>
                        {manual.img && (
                          <div className="h-40 w-full rounded-lg bg-surface-container flex items-center justify-center overflow-hidden">
                            <img
                              src={manual.img}
                              alt={`${name} ${manual.step || i + 1}단계`}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-xl bg-surface-container px-4 py-3 text-sm font-medium text-on-surface-variant">
                  조리법 정보가 없습니다
                </p>
              )}
            </section>
          )}

        </div>
      </Card>
    </div>,
    document.body
  );
}
