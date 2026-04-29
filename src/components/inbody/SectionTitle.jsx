export default function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div>
      <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{eyebrow}</span>
      <h2 className="text-xl font-extrabold text-on-surface tracking-tight mt-1">{title}</h2>
      <p className="text-sm text-on-surface-variant mt-0.5">{sub}</p>
    </div>
  );
}
