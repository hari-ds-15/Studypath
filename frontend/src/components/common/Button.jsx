import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, ghost, danger, success
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base font-semibold rounded-xl gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shadow-md shadow-amber-400/20 border border-amber-300 active:bg-amber-500',
    secondary: 'bg-stone-100 dark:bg-stone-800/90 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700/80 shadow-xs active:bg-stone-200',
    outline: 'bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/50 font-semibold',
    ghost: 'bg-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/60',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 border border-rose-400/30 font-semibold',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 border border-emerald-400/30 font-semibold',
  };

  return (
    <motion.button
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.015 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.985 } : undefined}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center select-none transition-all duration-150 tracking-tight
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4'} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
