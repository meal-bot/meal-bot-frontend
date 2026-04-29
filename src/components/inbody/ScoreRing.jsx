export default function ScoreRing({ score, delta }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
        <circle cx="88" cy="88" r={radius} fill="none" stroke="var(--color-outline-variant)" strokeWidth="10" />
        <circle
          cx="88" cy="88" r={radius} fill="none"
          stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">SCORE</span>
        <span className="text-5xl font-extrabold text-on-surface tabular-nums leading-none mt-0.5">{score}</span>
        <span className={`text-xs font-bold mt-2 flex items-center gap-0.5 ${delta >= 0 ? 'text-primary' : 'text-secondary'}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            {delta >= 0 ? 'trending_up' : 'trending_down'}
          </span>
          {delta >= 0 ? '+' : ''}{delta} pts
        </span>
      </div>
    </div>
  );
}
