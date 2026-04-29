import { evaluate, gaugePosition } from '../../data/inbodyData';

const STATUS_MAP = {
  normal:  { label: '정상',  color: 'text-primary',          dot: 'bg-primary' },
  low:     { label: '부족',  color: 'text-secondary',         dot: 'bg-secondary' },
  high:    { label: '과다',  color: 'text-secondary',         dot: 'bg-secondary' },
  unknown: { label: '미입력', color: 'text-on-surface-variant', dot: 'bg-outline-variant' },
};

export default function GaugeRow({ field, value }) {
  const status = evaluate(value, field.range);
  const pos = gaugePosition(value, field.range);
  const s = STATUS_MAP[status];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '18px' }}>{field.icon}</span>
          <span className="text-sm font-bold text-on-surface">{field.label}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${s.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <span className="text-base font-extrabold text-on-surface tabular-nums">
          {value ?? '—'}<span className="text-xs font-bold text-on-surface-variant ml-0.5">{field.unit}</span>
        </span>
      </div>

      <div className="relative h-2.5 rounded-full bg-surface-container overflow-hidden">
        <div className="absolute top-0 bottom-0 bg-primary-container" style={{ left: '30%', width: '40%' }} />
        {value != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-on-surface border-2 border-white shadow-md"
            style={{ left: `calc(${pos}% - 7px)` }}
          />
        )}
      </div>
      <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant tabular-nums">
        <span>낮음</span>
        <span>정상 {field.range[0]}–{field.range[1]} {field.unit}</span>
        <span>높음</span>
      </div>
    </div>
  );
}
