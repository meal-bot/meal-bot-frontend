import { Card } from '../../../shared/components/ui';
import { calculateBmi, formatDelta, formatNumber } from '../utils/inbodyDisplay';

const summaryItems = [
  { key: 'weight', label: '체중', unit: 'kg', icon: 'monitor_weight', direction: 'down' },
  { key: 'bmi', label: 'BMI', unit: '', icon: 'speed', direction: 'down', value: calculateBmi },
  { key: 'bodyFatPercent', label: '체지방률', unit: '%', icon: 'percent', direction: 'down', optional: true },
];

export default function InBodySummaryCards({ current, previous }) {
  if (!current) return null;

  const items = summaryItems.filter(item => !item.optional || current[item.key] != null);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map(item => {
        const currentValue = item.value ? item.value(current) : current[item.key];
        const previousValue = previous ? (item.value ? item.value(previous) : previous[item.key]) : null;
        const delta = formatDelta(currentValue, previousValue, item.unit ? ` ${item.unit}` : '');
        const isGood = delta == null
          ? null
          : item.direction === 'down'
            ? Number(currentValue) <= Number(previousValue)
            : Number(currentValue) >= Number(previousValue);

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
            <p className={`mt-5 text-xs font-bold ${isGood === null ? 'text-on-surface-variant' : isGood ? 'text-primary' : 'text-secondary'}`}>
              {delta ? `${delta} vs 이전 측정` : '이전 기록 없음'}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
