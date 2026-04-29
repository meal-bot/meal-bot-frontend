export default function TrendChart({ history }) {
  const W = 720, H = 220, P = 32;
  const innerW = W - P * 2, innerH = H - P * 2;
  const weights = history.map(h => h.weight);
  const fats = history.map(h => h.bodyFatPercent);
  const wMin = Math.min(...weights) - 1, wMax = Math.max(...weights) + 1;
  const fMin = Math.min(...fats) - 1, fMax = Math.max(...fats) + 1;

  const xAt = (i) => P + (i / (history.length - 1)) * innerW;
  const yWeight = (v) => P + innerH - ((v - wMin) / (wMax - wMin)) * innerH;
  const yFat = (v) => P + innerH - ((v - fMin) / (fMax - fMin)) * innerH;

  const path = (vals, yFn) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yFn(v)}`).join(' ');

  const area = (vals, yFn) => {
    const top = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i)} ${yFn(v)}`).join(' ');
    return `${top} L ${xAt(vals.length - 1)} ${H - P} L ${xAt(0)} ${H - P} Z`;
  };

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[600px] h-56">
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <line key={t}
            x1={P} x2={W - P}
            y1={P + t * innerH} y2={P + t * innerH}
            stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray={t === 0 || t === 1 ? '' : '2 4'} />
        ))}

        <path d={area(weights, yWeight)} fill="var(--color-primary)" opacity="0.08" />
        <path d={path(weights, yWeight)} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {weights.map((v, i) => (
          <circle key={`w${i}`} cx={xAt(i)} cy={yWeight(v)} r={i === weights.length - 1 ? 5 : 3} fill="var(--color-primary)" stroke="white" strokeWidth="2" />
        ))}

        <path d={path(fats, yFat)} fill="none" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
        {fats.map((v, i) => (
          <circle key={`f${i}`} cx={xAt(i)} cy={yFat(v)} r={i === fats.length - 1 ? 5 : 3} fill="var(--color-secondary)" stroke="white" strokeWidth="2" />
        ))}

        {history.map((h, i) => (
          <text key={`${h.date}-${i}`} x={xAt(i)} y={H - 6} fontSize="10" fontWeight="600" textAnchor="middle" fill="var(--color-on-surface-variant)">
            {h.date.slice(5).replace('-', '/')}
          </text>
        ))}

        <text x={xAt(weights.length - 1) + 8} y={yWeight(weights[weights.length - 1]) + 4} fontSize="11" fontWeight="800" fill="var(--color-primary)">
          {weights[weights.length - 1]}kg
        </text>
        <text x={xAt(fats.length - 1) + 8} y={yFat(fats[fats.length - 1]) + 4} fontSize="11" fontWeight="800" fill="var(--color-secondary)">
          {fats[fats.length - 1]}%
        </text>
      </svg>

      <div className="flex items-center gap-5 mt-3 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-on-surface">
          <span className="w-3 h-0.5 bg-primary rounded-full" /> 체중 (kg)
        </span>
        <span className="flex items-center gap-1.5 font-bold text-on-surface">
          <span className="w-3 h-0.5 bg-secondary rounded-full" style={{ borderTop: '2px dashed' }} /> 체지방률 (%)
        </span>
      </div>
    </div>
  );
}
