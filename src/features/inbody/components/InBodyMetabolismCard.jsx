import { Card } from '../../../shared/components/ui';
import { getActivityInfo } from '../utils/inbodyDisplay';

export default function InBodyMetabolismCard({ current }) {
  const bmr = current?.bmr ?? null;
  const dailyCalories = current?.dailyCalories ?? null;
  const activity = getActivityInfo(current?.activityLevel);

  return (
    <Card padding="lg" className="rounded-[22px]">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
          Calories
        </p>
        <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">대사량 기록</h3>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          입력값을 바탕으로 계산된 기초대사량과 예상 일일 권장 칼로리입니다.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CalorieMetric
          label="기초대사량"
          value={bmr}
          unit="kcal/day"
          icon="local_fire_department"
        />
        <CalorieMetric
          label="예상 일일 권장 칼로리"
          value={dailyCalories}
          unit="kcal"
          icon="restaurant"
          highlighted
        />
      </div>

      <div className="mt-5 rounded-2xl bg-surface-container-low px-4 py-3 text-xs font-bold leading-6 text-on-surface-variant">
        활동량 설정: <span className="text-on-surface">{activity.label}</span>
        <span className="mx-2 text-outline">/</span>
        계수 {activity.factor}
      </div>
    </Card>
  );
}

function CalorieMetric({ label, value, unit, icon, highlighted = false }) {
  return (
    <div className={`rounded-2xl border px-4 py-4 ${highlighted ? 'border-primary-container bg-primary-container/45' : 'border-outline-variant/30 bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-on-surface-variant">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-on-surface tabular-nums">
            {value != null ? value.toLocaleString() : '-'}
          </p>
          <p className="mt-1 text-xs font-bold text-on-surface-variant">{unit}</p>
        </div>
        <span className="material-symbols-outlined text-xl text-primary">{icon}</span>
      </div>
    </div>
  );
}
