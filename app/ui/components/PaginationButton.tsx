import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'active';
}

export const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(
  function PaginationButton({ children, variant = 'default', className = '', ...props }, ref) {
    const baseStyles = 
      'inline-flex h-10 items-center justify-center rounded-full px-3 min-w-[40px] text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#3A6FF8]/50 focus:ring-offset-2 focus:ring-offset-[#0C1220]';
    
    const variantStyles = {
      active: 'bg-[#3A6FF8] text-white shadow-lg shadow-[#3A6FF8]/30',
      default: 'border border-white/10 bg-white/5 text-white/70 hover:border-[#3A6FF8]/50 hover:bg-[#3A6FF8]/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/5',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  }
);