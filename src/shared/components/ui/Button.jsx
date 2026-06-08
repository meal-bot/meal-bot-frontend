import { cn } from '../../utils/cn';

const variants = {
  primary: 'bg-primary text-white hover:opacity-90',
  secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-low',
  neutral: 'bg-on-surface text-white hover:opacity-90',
  ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
  outline: 'bg-white text-on-surface border border-outline-variant hover:bg-surface-container',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  icon: 'h-11 w-11 p-0',
  iconSm: 'h-8 w-8 p-0',
  iconXs: 'h-6 w-6 p-0',
};

export default function Button({
  as: Component = 'button',
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:pointer-events-none disabled:opacity-50',
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
