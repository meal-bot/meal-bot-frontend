import { useParams, useNavigate } from 'react-router-dom';
import Navigationbar from '../../../shared/components/layout/Navigationbar';
import MEAL_DATA from '../data/mealData';
import Layout from '../../../shared/components/layout/Layout';

export default function MealDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const meal = MEAL_DATA.find((m) => m.id === Number(id));

  if (!meal) {
    return (
      <>
        <Navigationbar />
        <div className="pt-32 text-center text-on-surface-variant">식단 정보를 찾을 수 없습니다.</div>
      </>
    );
  }

  return (
    <Layout>
      <div className="text-on-surface selection:bg-primary-container">
        <main className="pb-20 px-6 max-w-3xl mx-auto">
          {/* 뒤로가기 */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <span className="material-symbols-outlined text-base">arrow_back_ios_new</span>
            돌아가기
          </button>

          {/* 이미지 */}
          <div className="w-full h-72 rounded-[2rem] overflow-hidden mb-8">
            <img src={meal.image} alt={meal.alt} className="w-full h-full object-cover" />
          </div>

          {/* 태그 + 제목 */}
          <span className={`text-[10px] font-bold ${meal.tagColor} uppercase tracking-widest mb-2 block`}>
            {meal.tagText}
          </span>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-4">{meal.title}</h1>

          {/* 시간 + 칼로리 */}
          <div className="flex items-center gap-6 text-on-surface-variant text-sm mb-6">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">schedule</span>
              {meal.time}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">local_fire_department</span>
              {meal.calories}
            </span>
          </div>

          {/* 설명 */}
          <p className="text-on-surface-variant leading-relaxed mb-8">{meal.description}</p>

          {/* 재료 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-on-surface mb-3">재료</h2>
            <ul className="grid grid-cols-2 gap-2">
              {meal.ingredients.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 조리 순서 */}
          <section>
            <h2 className="text-lg font-bold text-on-surface mb-3">조리 순서</h2>
            <ol className="flex flex-col gap-3">
              {meal.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </Layout>
  );
}
