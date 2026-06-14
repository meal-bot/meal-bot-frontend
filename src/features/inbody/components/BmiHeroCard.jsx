import { Badge, Card } from '../../../shared/components/ui';
import {
  calculateBmi,
  clamp,
  formatDelta,
  formatNumber,
  getActivityInfo,
  getBmiGrade,
} from '../utils/inbodyDisplay';

export default function BmiHeroCard({ current, previous }) {
  const bmi = calculateBmi(current);
  const grade = getBmiGrade(bmi);
  const activity = getActivityInfo(current?.activityLevel);
  const bmiDelta = previous ? formatDelta(bmi, calculateBmi(previous)) : null;

  return (
    <Card padding="none" className="overflow-hidden rounded-[22px] shadow-[0_18px_48px_rgba(74,68,63,0.07)]">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        <div className="flex flex-col justify-center gap-5 bg-primary-container/45 px-8 py-9 lg:border-r lg:border-outline-variant/30">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-on-surface-variant">
              Weight Range
            </p>
            <strong className="mt-3 block break-keep text-5xl font-black tracking-tight text-on-surface">
              {grade.label}
            </strong>
            <p className="mt-3 text-sm font-bold text-on-surface-variant">
              BMI 기준 체중 구간
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={grade.tone} size="md" className="px-4 py-2">
              BMI {formatNumber(bmi)}
            </Badge>
            {bmiDelta && (
              <Badge variant="muted" size="md" className="px-4 py-2">
                이전 대비 {bmiDelta}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6 px-8 py-8">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
              Latest Summary
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              최근 입력값 요약
            </h2>
          </div>

          <BmiRangeBar bmi={bmi} />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <HeroMetric label="체중" value={current?.weight} unit="kg" />
            <HeroMetric label="키" value={current?.height} unit="cm" />
            <HeroMetric label="나이" value={current?.age} unit="세" />
            <HeroMetric label="성별" value={current?.gender ?? '-'} />
            <HeroMetric label="활동량" value={activity.label} compact />
          </div>
        </div>
      </div>
    </Card>
  );
}

function BmiRangeBar({ bmi }) {
  const bmiPosition = bmi == null ? 0 : clamp(((bmi - 15) / 17) * 100, 2, 98);

  return (
    <div className="rounded-2xl bg-surface-container-low p-5">
      <div className="mb-4 flex items-center justify-between text-xs font-bold text-on-surface-variant">
        <span>BMI 기준 구간</span>
        <span className="tabular-nums">18.5 / 23 / 25 / 30</span>
      </div>
      <div className="relative h-4 overflow-hidden rounded-full bg-surface-container">
        <div className="absolute inset-y-0 left-0 w-[21%] bg-outline-variant/35" />
        <div className="absolute inset-y-0 left-[21%] w-[26%] bg-primary-container" />
        <div className="absolute inset-y-0 left-[47%] w-[12%] bg-secondary-container" />
        <div className="absolute inset-y-0 left-[59%] right-0 bg-error-container" />
        {bmi != null && (
          <span
            className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-white bg-primary shadow-md"
            style={{ left: `calc(${bmiPosition}% - 12px)` }}
          />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-on-surface-variant">
        <span>저체중</span>
        <span>정상</span>
        <span>과체중</span>
        <span>비만</span>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, unit = '', compact = false }) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-white px-4 py-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-on-surface-variant">
        {label}
      </p>
      <p className={`mt-1 font-black text-on-surface ${compact ? 'text-sm leading-5' : 'text-xl tabular-nums'}`}>
        {typeof value === 'number' ? formatNumber(value) : value ?? '-'}
        {unit && <span className="ml-1 text-xs font-bold text-on-surface-variant">{unit}</span>}
      </p>
    </div>
  );
}
