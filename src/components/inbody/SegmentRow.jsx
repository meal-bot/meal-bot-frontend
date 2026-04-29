import { evaluate } from '../../data/inbodyData';

export default function SegmentRow({ segment }) {
  const status = evaluate(segment.value, segment.normal);
  const inRange = status === 'normal';
  const [lo, hi] = segment.normal;
  const span = hi - lo;
  const extLo = lo - span * 0.6, extHi = hi + span * 0.6;
  const pct = Math.max(2, Math.min(98, ((segment.value - extLo) / (extHi - extLo)) * 100));

  return (
    <div className="grid grid-cols-[80px_1fr_70px] items-center gap-3">
      <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">{segment.short}</span>
        {segment.label}
      </span>
      <div className="relative h-2 rounded-full bg-surface-container overflow-hidden">
        <div className="absolute top-0 bottom-0 bg-primary-container" style={{ left: '30%', width: '40%' }} />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${inRange ? 'bg-primary' : 'bg-secondary'}`}
          style={{ left: `calc(${pct}% - 5px)` }}
        />
      </div>
      <span className="text-sm font-extrabold text-on-surface tabular-nums text-right">
        {segment.value}<span className="text-[10px] font-bold text-on-surface-variant ml-0.5">kg</span>
      </span>
    </div>
  );
}
