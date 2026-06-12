import { Button, Card, EmptyState } from '../../../shared/components/ui';
import { ADVANCED_FIELDS, evaluate, gaugePosition } from '../data/inbodyData';
import { formatNumber } from '../utils/inbodyDisplay';

const statusMap = {
  normal: {
    label: '참고 범위 내',
    className: 'text-primary',
    dot: 'bg-primary',
  },
  low: {
    label: '참고 범위보다 낮은 편',
    className: 'text-blue-500',
    dot: 'bg-blue-500',
  },
  high: {
    label: '참고 범위보다 높은 편',
    className: 'text-secondary',
    dot: 'bg-secondary',
  },
  unknown: {
    label: '미입력',
    className: 'text-on-surface-variant',
    dot: 'bg-outline-variant',
  },
};

export default function InBodyMetricsCard({ current, onNewMeasure }) {
  const visibleFields = ADVANCED_FIELDS.filter(field => current?.[field.key] != null);

  return (
    <Card padding="lg" className="rounded-[24px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Reference Metrics
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">선택 항목 참고 지표</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            입력된 선택 항목을 참고 범위와 함께 보여줍니다. 개인별 기준은 성별, 나이, 체형에 따라 달라질 수 있습니다.
          </p>
        </div>
        <Button variant="outline" onClick={onNewMeasure}>
          <span className="material-symbols-outlined text-base">edit</span>
          측정값 입력
        </Button>
      </div>

      {visibleFields.length > 0 ? (
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleFields.map(field => (
            <MetricGauge key={field.key} field={field} value={current[field.key]} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="analytics"
          title="선택 인바디 항목이 없습니다"
          description="필수 입력만으로도 BMI와 권장 칼로리는 볼 수 있습니다. 더 자세한 참고 지표는 선택 항목을 추가하면 표시됩니다."
          className="mt-7 bg-white"
          action={(
            <Button variant="outline" onClick={onNewMeasure}>
              <span className="material-symbols-outlined text-base">add</span>
              선택 항목 추가
            </Button>
          )}
        />
      )}
    </Card>
  );
}

function MetricGauge({ field, value }) {
  const status = evaluate(value, field.range);
  const statusInfo = statusMap[status];
  const position = gaugePosition(value, field.range);

  return (
    <div className="rounded-2xl border border-outline-variant/25 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined rounded-xl bg-surface-container p-2 text-on-surface-variant">
            {field.icon}
          </span>
          <div>
            <p className="text-sm font-black text-on-surface">{field.label}</p>
            <p className={`mt-1 flex items-center gap-1.5 text-[11px] font-extrabold ${statusInfo.className}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </p>
          </div>
        </div>
        <p className="text-right text-xl font-black text-on-surface tabular-nums">
          {formatNumber(value)}
          <span className="ml-1 text-xs font-bold text-on-surface-variant">{field.unit}</span>
        </p>
      </div>

      <div className="mt-5">
        <div className="relative h-3 rounded-full bg-surface-container">
          <div className="absolute inset-y-0 left-[30%] w-[40%] rounded-full bg-primary-container" />
          <span
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[3px] border-white bg-on-surface shadow-md"
            style={{ left: `calc(${position}% - 10px)` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-bold text-on-surface-variant">
          <span>낮음</span>
          <span>참고 {field.range[0]}-{field.range[1]} {field.unit}</span>
          <span>높음</span>
        </div>
      </div>
    </div>
  );
}
