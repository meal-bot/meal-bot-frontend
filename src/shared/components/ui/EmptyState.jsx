import { cn } from '../../utils/cn';

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low px-6 py-10',
        className,
      )}
    >
      {icon && (
        <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-3">
          {icon}
        </span>
      )}
      {title && <p className="text-sm font-bold text-on-surface">{title}</p>}
      {description && <p className="text-xs text-on-surface-variant leading-relaxed mt-1.5">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
