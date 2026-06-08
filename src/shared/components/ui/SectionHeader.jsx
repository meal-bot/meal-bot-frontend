import Badge from './Badge';
import { cn } from '../../utils/cn';

export default function SectionHeader({
  step,
  eyebrow,
  title,
  caption,
  tone = 'primary',
  className,
  actions,
}) {
  const badgeVariant = tone === 'secondary' ? 'secondary' : tone === 'danger' ? 'danger' : 'primary';
  const label = step ? `STEP ${step}` : eyebrow;

  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-center gap-3">
        {label && (
          <Badge variant={badgeVariant} size="sm" className="uppercase tracking-widest">
            {label}
          </Badge>
        )}
        <div>
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight">{title}</h2>
          {caption && <p className="text-xs text-on-surface-variant mt-0.5">{caption}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}
