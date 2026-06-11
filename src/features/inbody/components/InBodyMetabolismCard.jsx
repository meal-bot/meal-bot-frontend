import { Badge, Card } from '../../../shared/components/ui';
import { AVG_STATS } from '../data/inbodyData';
import { clamp, formatNumber, getActivityInfo } from '../utils/inbodyDisplay';

export default function InBodyMetabolismCard({ current }) {
  const bmr = current?.bmr ?? null;
  const dailyCalories = current?.dailyCalories ?? null;
  const activity = getActivityInfo(current?.activityLevel);
  const diff = bmr == null ? null : Math.round(bmr - AVG_STATS.bmr);
  const baseRatio = bmr && dailyCalories ? clamp((bmr / dailyCalories) * 100, 25, 95) : 0;

  return (
    <Card padding="lg" className="rounded-[24px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Metabolism
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">기초대사량</h3>
        </div>
        {diff != null && (
          <Badge variant={diff >= 0 ? 'primary' : 'muted'} size="md">
            {diff >= 0 ? '+' : ''}{diff.toLocaleString()} kcal
          </Badge>
        )}
      </div>

      <div className="mt-7">
        <p className="text-xs font-extrabold text-on-surface-variant">내 BMR</p>
        <div className="mt-2 flex items-end gap-2">
          <strong className="text-5xl font-black tracking-tight text-on-surface tabular-nums">
            {bmr != null ? bmr.toLocaleString() : '-'}
          </strong>
          <span className="pb-2 text-sm font-bold text-on-surface-variant">kcal / day</span>
        </div>
        <p className="mt-2 text-xs leading-6 text-on-surface-variant">
          기준 평균 {AVG_STATS.bmr.toLocaleString()} kcal와 비교한 값입니다.
        </p>
      </div>

      <div className="mt-7 rounded-2xl bg-primary px-5 py-4 text-white">
        <p className="text-xs font-bold text-white/70">오늘 하루 권장 섭취 칼로리</p>
        <div className="mt-1 flex items-baseline gap-2">
          <strong className="text-4xl font-black tracking-tight tabular-nums">
            {dailyCalories != null ? dailyCalories.toLocaleString() : '-'}
          </strong>
          <span className="text-sm font-bold text-white/75">kcal</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-on-surface-variant">
          <span>기초대사</span>
          <span>{activity.label}{activity.fallback ? ' 기준' : ''}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-surface-container">
          <div className="bg-primary" style={{ width: `${baseRatio}%` }} />
          <div className="bg-secondary-container" style={{ width: `${100 - baseRatio}%` }} />
        </div>
        <p className="mt-2 text-xs leading-6 text-on-surface-variant">
          권장 칼로리는 BMR에 활동계수를 반영한 값입니다.
        </p>
      </div>
    </Card>
  );
}
