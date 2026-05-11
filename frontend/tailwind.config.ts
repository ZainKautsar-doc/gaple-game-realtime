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
        nb: {
          primary: '#0001bb',
          'primary-pure': '#0000ff',
          secondary: '#e7e700',
          tertiary: '#9d0100',
          'tertiary-dark': '#720100',
          surface: '#fbf8ff',
          'surface-low': '#f5f2ff',
          'on-surface': '#1a1b26',
          outline: '#000000',
          white: '#ffffff',
          placeholder: '#757589',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-anton)', 'Impact', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
      },
      spacing: {
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
        'xs': '4px',
        'sm': '12px',
        'md': '24px',
        'lg': '48px',
        'xl': '80px',
      },
      borderRadius: {
        none: '0px',
        full: '9999px',
      },
      boxShadow: {
        'nb-sm': '4px 4px 0px #000000',
        'nb-md': '8px 8px 0px #000000',
        nb: '4px 4px 0px #000000',
      },
      keyframes: {
        'nb-block-pulse': {
          '0%, 100%': { backgroundColor: '#f5f2ff' },
          '50%': { backgroundColor: '#e7e700' },
        },
      },
      animation: {
        'nb-pulse': 'nb-block-pulse 1s steps(2, jump-none) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
