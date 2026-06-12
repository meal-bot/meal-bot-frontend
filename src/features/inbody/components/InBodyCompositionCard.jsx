import { Button, Card, EmptyState } from '../../../shared/components/ui';
import { formatNumber, getBodyComposition } from '../utils/inbodyDisplay';

export default function InBodyCompositionCard({ current, onNewMeasure }) {
  const composition = getBodyComposition(current);

  return (
    <Card padding="lg" className="flex h-full flex-col rounded-[24px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Composition
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">체성분 구성</h3>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">stacked_bar_chart</span>
      </div>

      {composition ? (
        <CompositionBreakdown composition={composition} />
      ) : (
        <EmptyState
          icon="add_chart"
          title="체성분 구성 데이터 없음"
          description="선택 입력 항목을 입력하면 체중 구성을 확인할 수 있습니다."
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

function CompositionBreakdown({ composition }) {
  const leanMass = Number(composition.leanMass);
  const fatMass = Number(composition.fatMass);
  const totalMass = leanMass + fatMass;
  const leanPercent = totalMass > 0 ? (leanMass / totalMass) * 100 : 0;
  const fatPercent = totalMass > 0 ? (fatMass / totalMass) * 100 : Number(composition.fatPercent);

  return (
    <div className="mt-7 flex flex-1 flex-col justify-center">
      <div className="rounded-3xl border border-outline-variant/35 bg-surface-container/45 px-5 py-5">
        <p className="text-xs font-extrabold text-on-surface-variant">총 체중 구성</p>
        <div className="mt-2 flex items-end gap-2">
          <strong className="text-4xl font-black tracking-tight text-on-surface tabular-nums">
            {formatNumber(totalMass)}
          </strong>
          <span className="pb-1 text-sm font-extrabold text-on-surface-variant">kg</span>
        </div>

        <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(100, leanPercent))}%` }}
          />
          <div
            className="h-full bg-secondary transition-all duration-700"
            style={{ width: `${Math.max(0, Math.min(100, fatPercent))}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs font-extrabold">
          <span className="flex items-center gap-1.5 text-primary">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            제지방 {formatNumber(leanPercent)}%
          </span>
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            체지방 {formatNumber(fatPercent)}%
          </span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CompositionMetric
          label="제지방량"
          value={leanMass}
          unit="kg"
          colorClassName="text-primary"
          icon="fitness_center"
          description="근육, 뼈, 수분 등 지방을 제외한 체중입니다."
        />
        <CompositionMetric
          label="체지방량"
          value={fatMass}
          unit="kg"
          colorClassName="text-secondary"
          icon="opacity"
          description="몸에 저장된 지방의 총량입니다."
        />
      </div>
    </div>
  );
}

function CompositionMetric({ label, value, unit, colorClassName, icon, description }) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-white px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-on-surface-variant">{label}</p>
          <p className={`mt-2 text-2xl font-black tabular-nums ${colorClassName}`}>
            {formatNumber(value)}
            <span className="ml-1 text-xs font-extrabold text-on-surface-variant">{unit}</span>
          </p>
        </div>
        <span className={`material-symbols-outlined text-xl ${colorClassName}`}>{icon}</span>
      </div>
      <p className="mt-3 text-[11px] font-semibold leading-5 text-on-surface-variant">
        {description}
      </p>
    </div>
  );
}
