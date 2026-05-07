import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui';

export default function MealCard({ meal }) {
  const navigate = useNavigate();

  return (
    <Card
      as="article"
      padding="none"
      className="min-w-[300px] md:min-w-[350px] flex-1 overflow-hidden snap-start group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/meal/${meal.id}`)}
    >
      <div className="h-56 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-8">
        <span className={`text-[10px] font-bold ${meal.tagColor} uppercase tracking-widest mb-3 block`}>
          {meal.tagText}
        </span>
        <h4 className="font-bold text-xl mb-3">{meal.title}</h4>
        <div className="flex items-center gap-4 text-on-surface-variant text-sm">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">schedule</span>
            {meal.time}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">local_fire_department</span>
            {meal.calories}
          </span>
        </div>
      </div>
    </Card>
  );
}
