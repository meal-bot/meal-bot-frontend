import { Button, Card, EmptyState } from '../../../shared/components/ui';
import { formatNumber, getBodyComposition } from '../utils/inbodyDisplay';

export default function InBodyCompositionCard({ current, onNewMeasure }) {
  const composition = getBodyComposition(current);
  const circumference = 2 * Math.PI * 58;
  const fatOffset = composition
    ? circumference - (circumference * composition.fatPercent) / 100
    : circumference;

  return (
    <Card padding="lg" className="flex h-full flex-col rounded-[24px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Composition
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">체성분 구성</h3>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">donut_large</span>
      </div>

      {composition ? (
        <div className="mt-7 flex flex-1 flex-col items-center justify-center gap-6">
          <div className="relative h-[158px] w-[158px]">
            <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
              <circle
                cx="75"
                cy="75"
                r="58"
                fill="none"
                stroke="var(--color-primary-container)"
                strokeWidth="18"
              />
              <circle
                cx="75"
                cy="75"
                r="58"
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={fatOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <strong className="text-3xl font-black text-on-surface tabular-nums">
                {formatNumber(composition.fatPercent)}
              </strong>
              <span className="text-xs font-bold text-on-surface-variant">체지방률</span>
            </div>
          </div>

          <div className="w-full space-y-4">
            <CompositionRow label="제지방량" value={composition.leanMass} unit="kg" color="bg-primary" />
            <CompositionRow label="체지방량" value={composition.fatMass} unit="kg" color="bg-secondary" />
            <p className="text-xs leading-6 text-on-surface-variant">
              선택 인바디 항목을 입력하면 체중을 구성하는 제지방과 체지방 비율을 더 명확하게 볼 수 있습니다.
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="add_chart"
          title="체성분 구성 데이터 없음"
          description="체지방량 또는 체지방률을 입력하면 구성 비율을 볼 수 있습니다."
          className="mt-7 border-outline-variant/45 bg-white"
          action={(
            <Button variant="outline" onClick={onNewMeasure}>
              <span className="material-symbols-outlined text-base">add</span>
              인바디 측정값 입력
            </Button>
          )}
        />
      )}
    </Card>
  );
}

function CompositionRow({ label, value, unit, color }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-2 text-on-surface">
          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
          {label}
        </span>
        <span className="tabular-nums text-on-surface">
          {formatNumber(value)}
          <span className="ml-1 text-xs text-on-surface-variant">{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-container">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(8, value * 1.4))}%` }} />
      </div>
    </div>
  );
}
