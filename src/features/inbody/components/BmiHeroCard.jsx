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
    <Card padding="none" className="overflow-hidden rounded-[24px] shadow-[0_18px_60px_rgba(74,68,63,0.08)]">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr]">
        <div className="flex flex-col justify-center gap-5 bg-gradient-to-b from-primary-container/55 to-white px-8 py-10 lg:border-r lg:border-outline-variant/30">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-on-surface-variant">
              BMI
            </p>
            <strong className="mt-3 block text-6xl font-black tracking-tight text-on-surface tabular-nums">
              {formatNumber(bmi)}
            </strong>
            <p className="mt-3 text-sm font-bold text-on-surface-variant">
              {bmiDelta ? `최근 측정 대비 ${bmiDelta}` : '최근 측정 기준'}
            </p>
          </div>

          <Badge variant={grade.tone} size="md" className="w-fit px-4 py-2">
            판정 · {grade.label}
          </Badge>
        </div>

        <div className="flex min-w-0 flex-col gap-7 px-8 py-9">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-primary">
              필수 입력 기반 계산 결과
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-on-surface">
              {grade.label} 구간
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-on-surface-variant">
              현재 BMI가 어느 구간에 있는지 확인합니다. 체성분 평가는 선택 인바디 항목을 함께 입력하면 더 정확하게 볼 수 있습니다.
            </p>
          </div>

          <BmiRangeBar bmi={bmi} />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <HeroMetric label="체중" value={current?.weight} unit="kg" />
            <HeroMetric label="키" value={current?.height} unit="cm" />
            <HeroMetric label="나이" value={current?.age} unit="세" />
            <HeroMetric label="성별" value={current?.gender ?? '-'} />
            <HeroMetric
              label="활동량"
              value={activity.label}
              compact
            />
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
        <span>BMI 구간</span>
        <span className="tabular-nums">18.5 · 23 · 25 · 30</span>
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
      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-on-surface-variant">
        {label}
      </p>
      <p className={`mt-1 font-black text-on-surface ${compact ? 'text-sm leading-5' : 'text-xl tabular-nums'}`}>
        {typeof value === 'number' ? formatNumber(value) : value ?? '-'}
        {unit && <span className="ml-1 text-xs font-bold text-on-surface-variant">{unit}</span>}
      </p>
    </div>
  );
}
