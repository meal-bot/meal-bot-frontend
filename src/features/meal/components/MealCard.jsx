import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui';

const formatCalories = (value) => {
  if (value == null) return null;
  const rounded = Math.round(Number(value));
  return Number.isFinite(rounded) ? `${rounded}kcal` : null;
};

export default function MealCard({ meal, onClick }) {
  const navigate = useNavigate();
  const recipeId = meal.recipeId || meal.id;
  const image = meal.imgThumb || meal.imgMain || meal.image;
  const title = meal.name || meal.title;
  const tagText = meal.category || meal.tagText || meal.tasteTags?.[0] || meal.dishTypeTags?.[0];
  const tagColor = meal.tagColor || 'text-primary';
  const time = meal.cookingTime != null ? `${meal.cookingTime}분` : meal.time;
  const calories = formatCalories(meal.nutrition?.energyKcal) || meal.calories;
  const alt = meal.alt || title;
  const handleClick = onClick || (() => navigate(`/meal/${recipeId}`));

  return (
    <Card
      as="article"
      padding="none"
      className="min-w-[300px] md:min-w-[350px] flex-1 overflow-hidden snap-start group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="h-56 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">restaurant</span>
          </div>
        )}
      </div>
      <div className="p-8">
        <span className={`text-[10px] font-bold ${tagColor} uppercase tracking-widest mb-3 block`}>
          {tagText}
        </span>
        <h4 className="font-bold text-xl mb-3">{title}</h4>
        <div className="flex items-center gap-4 text-on-surface-variant text-sm">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">schedule</span>
            {time}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">local_fire_department</span>
            {calories}
          </span>
        </div>
      </div>
    </Card>
  );
}
