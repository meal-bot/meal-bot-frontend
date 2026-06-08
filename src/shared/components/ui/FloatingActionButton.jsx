import { cn } from '../../utils/cn';

export default function FloatingActionButton({
  icon,
  label,
  className,
  iconClassName,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'pointer-events-auto inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant bg-surface px-4 text-sm font-semibold text-on-surface shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40',
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn('material-symbols-outlined text-base', iconClassName)}>
          {icon}
        </span>
      )}
      <span>{label}</span>
    </button>
  );
}
