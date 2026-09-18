import React from 'react';
import { motion } from 'framer-motion';

const BackgroundMesh = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAF7F0] dark:bg-[#201D1A] transition-colors duration-500">
      {/* Sunlit Glowing Orb 1 (Top Left) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[15%] -left-[10%] w-[700px] h-[700px] rounded-full opacity-70 blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(254, 240, 138, 0.9), rgba(251, 191, 36, 0.5), transparent)'
        }}
      />

      {/* Sunlit Glowing Orb 2 (Top Right) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -45, 0],
          y: [0, 35, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[10%] -right-[10%] w-[750px] h-[650px] rounded-full opacity-60 blur-[140px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(253, 224, 71, 0.8), rgba(245, 158, 11, 0.45), transparent)'
        }}
      />

      {/* Warm Ambient Center / Bottom Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.65, 0.4]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[40%] left-[25%] w-[650px] h-[550px] rounded-full opacity-50 blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(254, 215, 170, 0.7), rgba(252, 211, 77, 0.4), transparent)'
        }}
      />

      {/* Floating Ambient Sparkles / Light Dust Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 6 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7
            }}
            className="absolute rounded-full bg-amber-300 shadow-sm"
            style={{
              top: `${15 + (i * 11)}%`,
              left: `${10 + (i * 12)}%`,
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Subtle Warm Canvas Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default BackgroundMesh;

