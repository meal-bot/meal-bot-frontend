import { cn } from '../../utils/cn';

export default function TextField({
  label,
  icon,
  error,
  unit,
  className,
  inputClassName,
  type = 'text',
  ...props
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3.5 border transition-colors',
          error ? 'border-error/60 focus-within:border-error' : 'border-outline-variant/30 focus-within:border-primary',
        )}
      >
        {icon && <span className="material-symbols-outlined text-on-surface-variant text-xl">{icon}</span>}
        <input
          type={type}
          className={cn(
            'flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 text-sm font-medium p-0',
            inputClassName,
          )}
          {...props}
        />
        {unit && <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{unit}</span>}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
