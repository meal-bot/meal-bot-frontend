import Button from './Button';
import { cn } from '../../utils/cn';

export default function IconButton({
  icon,
  label,
  className,
  iconClassName,
  ...props
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={label}
      title={label}
      className={className}
      {...props}
    >
      <span className={cn('material-symbols-outlined text-xl', iconClassName)}>
        {icon}
      </span>
    </Button>
  );
}
