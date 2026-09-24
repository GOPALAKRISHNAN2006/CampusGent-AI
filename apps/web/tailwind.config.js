/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          black: '#000000',
          espresso: '#1F150C',
          bronze: '#412D15',
          sandstone: '#E1DCC9',
          'sandstone-light': '#F4EFE6',
          'sandstone-canvas': '#FAF7F2',
        },
        brand: {
          50: '#FAF7F2',
          100: '#F4EFE6',
          200: '#E1DCC9',
          300: '#C9BF9F',
          400: '#8F7554',
          450: '#6B5336',
          500: '#523B20',
          600: '#412D15',
          650: '#31210F',
          700: '#261A0C',
          800: '#1F150C',
          850: '#140D07',
          900: '#0A0704',
          950: '#000000',
        },
        indigo: {
          50: '#FAF7F2',
          100: '#F4EFE6',
          150: '#E1DCC9',
          200: '#D8D1BC',
          300: '#C9BF9F',
          350: '#8F7554',
          400: '#6B5336',
          500: '#412D15',
          600: '#412D15',
          650: '#31210F',
          700: '#261A0C',
          800: '#1F150C',
          850: '#140D07',
          900: '#0A0704',
          950: '#000000',
        },
        campus: {
          primary: '#1F150C',
          accent: '#412D15',
          sandstone: '#E1DCC9',
          dark: '#000000',
          card: '#FFFFFF',
          border: '#E1DCC9',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Outfit', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(65, 45, 21, 0.45)',
        'glow-bronze': '0 0 25px -5px rgba(65, 45, 21, 0.4)',
        'glow-sandstone': '0 0 25px -5px rgba(225, 220, 201, 0.35)',
        'subtle': '0 1px 3px 0 rgba(31, 21, 12, 0.05), 0 1px 2px -1px rgba(31, 21, 12, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(31, 21, 12, 0.1), 0 4px 6px -2px rgba(31, 21, 12, 0.04)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
