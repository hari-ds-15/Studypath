import React from 'react';

const Badge = ({
  children,
  variant = 'indigo', // indigo, emerald, amber, rose, sky, purple, slate
  size = 'md', // sm, md
  className = '',
  icon: Icon
}) => {
  const variantStyles = {
    indigo: 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-500/30',
    amber: 'bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-500/30',
    yellow: 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-200/80 dark:border-yellow-500/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/30',
    rose: 'bg-rose-50 dark:bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-500/30',
    sky: 'bg-sky-50 dark:bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-200/80 dark:border-sky-500/30',
    purple: 'bg-purple-50 dark:bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-500/30',
    slate: 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium tracking-wide
        ${variantStyles[variant] || variantStyles.indigo}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
};

export default Badge;
