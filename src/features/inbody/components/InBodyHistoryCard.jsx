import { Badge, Card, IconButton } from '../../../shared/components/ui';
import { calculateBmi, formatDate, formatNumber } from '../utils/inbodyDisplay';

export default function InBodyHistoryCard({ records, onDeleteRecord }) {
  const visibleRecords = records.slice(0, 5);

  return (
    <Card padding="lg" className="rounded-[22px]">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
          History
        </p>
        <h3 className="mt-2 text-xl font-black tracking-tight text-on-surface">입력 기록</h3>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-outline-variant/25">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_44px] gap-3 bg-surface-container-low px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-on-surface-variant">
          <span>입력일</span>
          <span className="text-right">체중</span>
          <span className="text-right">BMI</span>
          <span className="text-right">체지방률</span>
          <span className="text-right">삭제</span>
        </div>
        {visibleRecords.map((record, index) => (
          <div
            key={record.id ?? `${record.measuredAt}-${index}`}
            className={`grid grid-cols-[1.2fr_1fr_1fr_1fr_44px] items-center gap-3 px-5 py-4 text-sm ${index !== visibleRecords.length - 1 ? 'border-b border-outline-variant/25' : ''} ${index === 0 ? 'bg-primary-container/25 font-bold text-on-surface' : 'bg-white text-on-surface-variant'}`}
          >
            <span className="min-w-0">
              {formatDate(record.measuredAt ?? record.date)}
              {index === 0 && <Badge variant="primary" size="xs" className="ml-2">최근</Badge>}
            </span>
            <span className="text-right tabular-nums">{formatNumber(record.weight)} kg</span>
            <span className="text-right tabular-nums">{formatNumber(calculateBmi(record))}</span>
            <span className="text-right tabular-nums">
              {record.bodyFatPercent != null ? `${formatNumber(record.bodyFatPercent)}%` : '-'}
            </span>
            <div className="flex justify-end">
              <IconButton
                icon="delete"
                label="인바디 기록 삭제"
                onClick={() => onDeleteRecord?.(record)}
                disabled={!record.id}
                className="h-9 w-9 text-on-surface-variant hover:bg-error-container hover:text-error"
                iconClassName="text-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
