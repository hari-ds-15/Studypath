import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.18 } } : undefined}
      whileTap={hover ? { scale: 0.995 } : undefined}
      onClick={onClick}
      className={`
        relative rounded-2xl bg-white/90 dark:bg-[#1C1917]/90 border border-stone-200/90 dark:border-stone-800/80 shadow-xs dark:shadow-xl dark:shadow-black/40 backdrop-blur-xl transition-all duration-200
        ${hover ? 'hover:border-amber-400/50 dark:hover:border-amber-400/40 hover:shadow-md hover:shadow-amber-500/5 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${glow ? 'ring-1 ring-amber-400/40 shadow-amber-400/10' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
