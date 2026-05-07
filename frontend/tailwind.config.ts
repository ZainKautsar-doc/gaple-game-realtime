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
      colors: {
        // Background
        'casino-bg-primary': '#0a3d2e',
        'casino-bg-secondary': '#072820',
        'casino-bg-surface': '#0d3b2f',
        'casino-bg-elevated': '#11473a',
        'casino-bg-table': '#1a5c45',
        
        // Accent
        'casino-gold': '#d4af37',
        'casino-gold-light': '#f0d58c',
        'casino-gold-dark': '#b8941f',
        'casino-brass': '#c5a572',
        'casino-ivory': '#f5f0e8',
        
        // Text
        'casino-text-primary': '#f5f0e8',
        'casino-text-secondary': '#c4b5a0',
        'casino-text-muted': '#8a7d6f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // 8px grid based system
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'casino': '12px',
        'casino-sm': '8px',
      },
      boxShadow: {
        'casino-sm': '0 2px 4px rgba(0, 0, 0, 0.3)',
        'casino-md': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'casino-lg': '0 8px 24px rgba(0, 0, 0, 0.5)',
        'casino-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'casino-glow-strong': '0 0 30px rgba(212, 175, 55, 0.5)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(212, 175, 55, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
