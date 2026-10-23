import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export const ThemeToggle = ({
  className = '',
  showLabel = false,
  variant = 'icon', // 'icon' | 'button' | 'pill'
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center p-1 bg-[#FAF7F2] dark:bg-[#18130E] border border-[#E1DCC9] dark:border-[#382818] rounded-full text-xs ${className}`}>
        <button
          type="button"
          onClick={() => isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
            !isDark
              ? 'bg-[#1F150C] text-[#E1DCC9] shadow-xs'
              : 'text-[#6B5336] dark:text-[#C9BF9F] hover:text-[#1F150C] dark:hover:text-white'
          }`}
          aria-label="Activate light theme"
        >
          <Sun className="h-3.5 w-3.5" />
          <span>Light</span>
        </button>
        <button
          type="button"
          onClick={() => !isDark && toggleTheme()}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
            isDark
              ? 'bg-[#412D15] text-[#FAF7F2] shadow-xs'
              : 'text-[#6B5336] dark:text-[#C9BF9F] hover:text-[#1F150C] dark:hover:text-white'
          }`}
          aria-label="Activate dark theme"
        >
          <Moon className="h-3.5 w-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer
        text-[#412D15] hover:text-[#1F150C] hover:bg-[#F4EFE6]
        dark:text-[#E1DCC9] dark:hover:text-white dark:hover:bg-[#261A0C]
        focus:outline-none focus:ring-2 focus:ring-[#412D15]/20 dark:focus:ring-[#E1DCC9]/20
        ${showLabel ? 'gap-2 px-3' : ''} ${className}`}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="h-4.5 w-4.5 text-[#E1DCC9] hover:text-amber-200 transition-colors" />
        ) : (
          <Moon className="h-4.5 w-4.5 text-[#412D15] hover:text-[#1F150C] transition-colors" />
        )}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-bold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </motion.button>
  );
};
