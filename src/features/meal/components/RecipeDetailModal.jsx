import { createPortal } from 'react-dom';
import { Card } from '../../../shared/components/ui';

// 추천 카드 클릭 시 뜨는 상세 모달 (read-only)
// recipe: 카드 데이터 + 백엔드 상세 데이터(nutrition/ingredients/instructions) 머지된 객체
// onClose: X 버튼 클릭 핸들러 (backdrop 클릭으로는 닫히지 않음)
export default function RecipeDetailModal({ recipe, onClose }) {
  if (!recipe) return null;

  const { name, mainIngredients, cookingTime, summary, reason,
          nutrition, ingredients, instructions } = recipe;

  const NUTRITION_LABELS = [
    { key: 'calories', label: '칼로리', unit: 'kcal', color: 'bg-primary-container text-primary' },
    { key: 'protein',  label: '단백질', unit: 'g',   color: 'bg-tertiary-container text-tertiary' },
    { key: 'carbs',    label: '탄수화물', unit: 'g', color: 'bg-secondary-container text-secondary' },
    { key: 'fat',      label: '지방',   unit: 'g',   color: 'bg-error-container text-error' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* 백드롭: 클릭으로 닫히지 않음 (X 버튼만으로 닫기) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <Card as="div" padding="none" className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* 헤더: 제목 + X 버튼 */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-outline-variant/20 px-6 py-4 flex items-start justify-between gap-4 z-10">
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

        <div className="px-6 py-5 flex flex-col gap-6">

          {/* 요약 / 추천 이유 */}
          {(summary || reason) && (
            <div className="flex flex-col gap-2">
              {summary && (
                <p className="text-sm text-on-surface-variant leading-relaxed">{summary}</p>
              )}
              {reason && (
                <p className="text-sm text-primary leading-relaxed font-medium">{reason}</p>
              )}
            </div>
          )}

          {/* 영양 정보 */}
          {nutrition && (
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
          {ingredients?.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-extrabold text-on-surface tracking-tight">식재료</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between items-baseline border-b border-outline-variant/20 py-1.5">
                    <span className="text-sm text-on-surface">{ing.name}</span>
                    <span className="text-xs font-medium text-on-surface-variant">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 조리법 */}
          {instructions?.length > 0 && (
            <section className="flex flex-col gap-2">
              <h3 className="text-sm font-extrabold text-on-surface tracking-tight">조리법</h3>
              <ol className="flex flex-col gap-3">
                {instructions.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-on-surface leading-relaxed flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

        </div>
      </Card>
    </div>,
    document.body
  );
}
