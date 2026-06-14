import { Card, EmptyState } from '../../../shared/components/ui';
import { ADVANCED_FIELDS } from '../data/inbodyData';
import { formatNumber } from '../utils/inbodyDisplay';

export default function InBodyMetricsCard({ current }) {
  const visibleFields = ADVANCED_FIELDS.filter(field => current?.[field.key] != null);

  return (
    <Card padding="lg" className="rounded-[22px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            Optional Values
          </p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">선택 입력 항목</h3>
        </div>
      </div>

      {visibleFields.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {visibleFields.map(field => (
            <OptionalValue key={field.key} field={field} value={current[field.key]} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="analytics"
          title="선택 입력 항목 없음"
          description="필수 항목만으로도 BMI와 권장 칼로리는 확인할 수 있습니다. 필요하면 인바디 결과지의 세부 항목을 추가로 입력하세요."
          className="mt-6 bg-white"
        />
      )}
    </Card>
  );
}

function OptionalValue({ field, value }) {
  return (
    <div className="rounded-2xl border border-outline-variant/25 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-on-surface-variant">{field.label}</p>
          <p className="mt-2 text-2xl font-black text-on-surface tabular-nums">
            {formatNumber(value)}
            <span className="ml-1 text-xs font-bold text-on-surface-variant">{field.unit}</span>
          </p>
        </div>
        <span className="material-symbols-outlined rounded-xl bg-surface-container p-2 text-lg text-on-surface-variant">
          {field.icon}
        </span>
      </div>
    </div>
  );
}
