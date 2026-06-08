import { cn } from '../../utils/cn';

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
  children,
}) {
  return (
    <header className={cn('mb-10', className)}>
      {children}
      <div className="flex items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2 block">
              {eyebrow}
            </span>
          )}
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">{title}</h1>
          {description && (
            <p className="text-on-surface-variant text-sm mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {(meta || actions) && (
          <div className="hidden sm:flex items-center gap-3 pb-1">
            {meta}
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
