export default function BodyDiagram() {
  return (
    <div className="relative w-44 mx-auto md:mx-0">
      <svg viewBox="0 0 140 200" className="w-full">
        <circle cx="70" cy="22" r="14" fill="var(--color-surface-container)" stroke="var(--color-outline-variant)" strokeWidth="1.5" />
        <rect x="50" y="42" width="40" height="60" rx="10" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="70" y="76" fontSize="9" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">몸통</text>
        <rect x="22" y="46" width="22" height="52" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="33" y="76" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">L</text>
        <rect x="96" y="46" width="22" height="52" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="107" y="76" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">R</text>
        <rect x="50" y="108" width="18" height="74" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="59" y="150" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">L</text>
        <rect x="72" y="108" width="18" height="74" rx="8" fill="var(--color-primary-container)" stroke="var(--color-primary)" strokeWidth="1.5" />
        <text x="81" y="150" fontSize="8" fontWeight="700" textAnchor="middle" fill="var(--color-primary)">R</text>
      </svg>
    </div>
  );
}
