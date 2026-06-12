import { Card } from '../../../shared/components/ui';
import { clamp, getActivityInfo } from '../utils/inbodyDisplay';

export default function InBodyMetabolismCard({ current }) {
  const bmr = current?.bmr ?? null;
  const dailyCalories = current?.dailyCalories ?? null;
  const activity = getActivityInfo(current?.activityLevel);
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
      </div>

      <div className="mt-7">
        <div className="mt-2 flex items-end gap-2">
          <strong className="text-5xl font-black tracking-tight text-on-surface tabular-nums">
            {bmr != null ? bmr.toLocaleString() : '-'}
          </strong>
          <span className="pb-2 text-sm font-bold text-on-surface-variant">kcal/day</span>
        </div>
        <p className="mt-2 text-xs leading-6 text-on-surface-variant">
          기초대사량은 활동량을 제외하고 몸이 기본적으로 소비하는 에너지입니다.
        </p>
      </div>

      <div className="mt-7 rounded-2xl border border-primary-container bg-primary-container/45 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-primary">하루 섭취 권장 칼로리</div>
            <p className="mt-1 text-[11px] font-bold text-on-surface-variant">
              BMR x 활동계수로 계산한 추정치
            </p>
          </div>
          <div className="flex items-baseline gap-1.5 text-right pt-0.5">
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
            BMR {bmr != null ? bmr.toLocaleString() : '-'}
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
          활동량은 선택한 활동 수준에 따라 달라집니다.
        </p>
      </div>
    </Card>
  );
}
