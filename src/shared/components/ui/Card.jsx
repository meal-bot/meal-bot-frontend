import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-white border border-outline-variant/20 shadow-sm',
  muted: 'bg-surface-container-low border border-outline-variant/40',
  accent: 'bg-primary-container/40 border border-outline-variant/30',
  primary: 'bg-primary border border-primary',
};

const padding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  as = 'section',
  variant = 'default',
  padding: pad = 'lg',
  className,
  children,
  ...props
}) {
  const Component = as;

  return (
    <Component
      className={cn('rounded-2xl', variants[variant], padding[pad], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
