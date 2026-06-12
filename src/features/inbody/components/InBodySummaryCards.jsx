import { Card } from '../../../shared/components/ui';
import { calculateBmi, formatDelta, formatNumber } from '../utils/inbodyDisplay';

const summaryItems = [
  { key: 'weight', label: '체중', unit: 'kg', icon: 'monitor_weight' },
  { key: 'bmi', label: 'BMI', unit: '', icon: 'speed', value: calculateBmi },
  { key: 'bodyFatPercent', label: '체지방률', unit: '%', icon: 'percent', optional: true },
];

export default function InBodySummaryCards({ current, previous }) {
  if (!current) return null;

  const items = summaryItems.filter(item => !item.optional || current[item.key] != null);
  const gridColumns = items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridColumns}`}>
      {items.map(item => {
        const currentValue = item.value ? item.value(current) : current[item.key];
        const previousValue = previous ? (item.value ? item.value(previous) : previous[item.key]) : null;
        const delta = formatDelta(currentValue, previousValue, item.unit ? ` ${item.unit}` : '');
        const diff = currentValue == null || previousValue == null
          ? null
          : Number((Number(currentValue) - Number(previousValue)).toFixed(1));
        const trendIcon = diff == null
          ? null
          : diff > 0
            ? 'trending_up'
            : diff < 0
              ? 'trending_down'
              : 'trending_flat';
        const trendColorClass = diff == null
          ? 'text-on-surface-variant'
          : diff > 0
            ? 'text-red-500'
            : diff < 0
              ? 'text-blue-500'
              : 'text-green-600';

        return (
          <Card key={item.key} padding="md" className="rounded-[22px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold text-on-surface-variant">{item.label}</p>
                <p className="mt-2 text-3xl font-black tracking-tight text-on-surface tabular-nums">
                  {formatNumber(currentValue)}
                  {item.unit && <span className="ml-1 text-sm font-bold text-on-surface-variant">{item.unit}</span>}
                </p>
              </div>
              <span className="material-symbols-outlined rounded-2xl bg-surface-container px-3 py-2 text-on-surface-variant">
                {item.icon}
              </span>
            </div>
            <div className={`mt-5 flex items-center gap-1.5 text-xs font-bold ${trendColorClass}`}>
              {trendIcon && (
                <span className="material-symbols-outlined text-base leading-none">
                  {trendIcon}
                </span>
              )}
              <span>{delta ? `최근 측정 대비 ${delta}` : '최근 측정 기록 없음'}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
