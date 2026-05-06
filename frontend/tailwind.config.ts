import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 40px rgba(0, 217, 255, 0.25)',
      },
      colors: {
        ink: '#0a0e27',
        panel: '#101735',
        line: '#223056',
        brand: {
          DEFAULT: '#00D9FF',
          light: '#79EAFF',
          dark: '#0090C4',
        },
        accent: '#39FF14',
        secondary: '#FF4FD8',
        success: '#00FF88',
        error: '#FF3333',
        aqua: '#00D9FF',
        mint: '#39FF14',
        gold: '#ffd66b',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
        drift: 'drift 18s linear infinite',
        glow: 'glow 2.8s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(61,245,191,0.25)' },
          '50%': { boxShadow: '0 0 26px rgba(61,245,191,0.55)' },
        },
        drift: {
          '0%': { transform: 'translate3d(-5%, 0, 0)' },
          '50%': { transform: 'translate3d(5%, -4%, 0)' },
          '100%': { transform: 'translate3d(-5%, 0, 0)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(0, 217, 255, 0.18)' },
          '50%': { boxShadow: '0 0 28px rgba(0, 217, 255, 0.32)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
