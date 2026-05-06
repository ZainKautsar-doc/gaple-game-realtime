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
        neon: '0 0 40px rgba(61, 245, 191, 0.25)',
      },
      colors: {
        ink: '#071117',
        panel: '#0d1a22',
        line: '#183342',
        mint: '#3df5bf',
        aqua: '#6ef3ff',
        ember: '#ff9f67',
        gold: '#ffd66b',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 1.8s ease-in-out infinite',
        drift: 'drift 18s linear infinite',
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
      },
    },
  },
  plugins: [],
};

export default config;

