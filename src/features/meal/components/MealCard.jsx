import { Card } from '../../../shared/components/ui';

// Spring GET /api/recipes/random 응답 구조를 받아 카드로 표시
// onClick: MainPage에서 선택된 레시피를 setState해 모달을 여는 핸들러
export default function MealCard({ recipe, onClick }) {
  const image = recipe.imgThumb || recipe.imgMain;
  const tagText = recipe.category || recipe.tasteTags?.[0];
  const time = recipe.cookingTime ? `${recipe.cookingTime}분` : null;
  const calories = recipe.nutrition?.energyKcal ? `${recipe.nutrition.energyKcal}kcal` : null;

  return (
    <Card
      as="article"
      padding="none"
      className="min-w-[300px] md:min-w-[350px] flex-1 overflow-hidden snap-start group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="h-56 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-container" />
        )}
      </div>
      <div className="p-8">
        {tagText && (
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 block">
            {tagText}
          </span>
        )}
        <h4 className="font-bold text-xl mb-3">{recipe.name}</h4>
        <div className="flex items-center gap-4 text-on-surface-variant text-sm">
          {time && (
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">schedule</span>
              {time}
            </span>
          )}
          {calories && (
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">local_fire_department</span>
              {calories}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
