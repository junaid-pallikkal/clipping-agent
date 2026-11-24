import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 h-8',
    md: 'text-sm px-4 py-2 gap-2 h-9',
    lg: 'text-base px-5 py-2.5 gap-2.5 h-11',
  };

  const variantClasses = {
    primary: 'bg-[#E54848] text-white hover:bg-[#C93636] active:bg-[#B32B2B] focus:ring-[#E54848]/30 shadow-xs shadow-[#E54848]/20',
    secondary: 'bg-[#F4F4F5] text-[#202124] hover:bg-[#E4E4E7] active:bg-[#D4D4D8] focus:ring-zinc-400/30',
    outline: 'border border-[#EEEEEE] bg-white text-[#202124] hover:bg-[#FAFAFA] hover:border-[#E4E4E7] focus:ring-zinc-400/30 shadow-xs',
    ghost: 'text-[#747474] hover:text-[#202124] hover:bg-zinc-100/80 focus:ring-zinc-300',
    destructive: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-500/30',
  };

  return (
    <button
      className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
