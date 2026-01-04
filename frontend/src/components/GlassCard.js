import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true, onClick, testId }) => {
  return (
    <motion.div
      data-testid={testId}
      onClick={onClick}
      className={`bg-card/50 backdrop-blur-md border border-border p-8 rounded-sm transition-all duration-500 group relative ${
        className.includes('overflow-visible') ? '' : 'overflow-hidden'
      } ${
        hover ? 'hover:border-primary/30 hover:-translate-y-1 cursor-pointer' : ''
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};