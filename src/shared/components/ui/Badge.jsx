import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary-container text-primary',
  secondary: 'bg-secondary-container text-secondary',
  muted: 'bg-surface-container text-on-surface-variant',
  danger: 'bg-error-container text-error',
  inverse: 'bg-on-surface text-white',
};

const sizes = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-1 text-[11px]',
  md: 'px-3 py-1.5 text-xs',
};

export default function Badge({
  as = 'span',
  variant = 'primary',
  size = 'sm',
  className,
  children,
  ...props
}) {
  const Component = as;

  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-full font-bold leading-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
