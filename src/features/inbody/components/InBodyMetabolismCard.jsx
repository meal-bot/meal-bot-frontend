import { Badge, Card } from '../../../shared/components/ui';
import { AVG_STATS } from '../data/inbodyData';
import { clamp, formatNumber, getActivityInfo } from '../utils/inbodyDisplay';

export default function InBodyMetabolismCard({ current }) {
  const bmr = current?.bmr ?? null;
  const dailyCalories = current?.dailyCalories ?? null;
  const activity = getActivityInfo(current?.activityLevel);
  const diff = bmr == null ? null : Math.round(bmr - AVG_STATS.bmr);
  const baseRatio = bmr && dailyCalories ? clamp((bmr / dailyCalories) * 100, 25, 95) : 0;
  const activityCalories = bmr && dailyCalories ? Math.max(0, Math.round(dailyCalories - bmr)) : null;

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

      <div className="mt-7 rounded-2xl border border-primary-container bg-primary-container/45 px-5 py-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-extrabold text-primary">오늘 하루 권장 섭취 칼로리</p>
          <div className="flex items-baseline gap-1.5 text-right">
            <strong className="text-3xl font-black tracking-tight text-on-surface tabular-nums">
              {dailyCalories != null ? dailyCalories.toLocaleString() : '-'}
            </strong>
            <span className="text-sm font-bold text-on-surface-variant">kcal</span>
          </div>
        </div>

        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/80">
          <div className="bg-primary" style={{ width: `${baseRatio}%` }} />
          <div className="bg-secondary-container" style={{ width: `${100 - baseRatio}%` }} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-on-surface">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[3px] bg-primary" />
            기초대사 {bmr != null ? bmr.toLocaleString() : '-'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[3px] bg-secondary-container" />
            활동량 {activityCalories != null ? activityCalories.toLocaleString() : '-'}
          </span>
          <span className="ml-auto text-on-surface-variant">
            BMR x 활동계수({activity.label})
          </span>
        </div>
        <p className="mt-3 text-xs leading-6 text-on-surface-variant">
          기초대사량에 현재 활동량을 반영해 산정한 하루 기준값입니다.
        </p>
      </div>
    </Card>
  );
}
