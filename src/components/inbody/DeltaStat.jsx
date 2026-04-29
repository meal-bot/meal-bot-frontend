export default function DeltaStat({ label, value, delta, good, suffixed }) {
  const arrow = parseFloat(delta) > 0 ? 'arrow_upward' : parseFloat(delta) < 0 ? 'arrow_downward' : 'remove';
  const color = good ? 'text-primary' : 'text-secondary';
  const sign = parseFloat(delta) > 0 ? '+' : '';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
      <span className="text-lg font-extrabold text-on-surface tabular-nums">{value}</span>
      {delta != null && (
        <span className={`text-xs font-semibold ${color} flex items-center gap-0.5 tabular-nums`}>
          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{arrow}</span>
          {sign}{delta}{suffixed ? ' kg' : ' '}
        </span>
      )}
    </div>
  );
}
