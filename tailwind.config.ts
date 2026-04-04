import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        1: '8px',
        2: '16px',
        3: '24px',
        4: '32px',
        5: '40px',
        6: '48px',
        8: '64px',
        12: '96px',
      },
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        gray: {
          50: '#F9F9F9',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#D0D0D0',
          400: '#A0A0A0',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#202020',
          900: '#101010',
        },
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.6' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['18px', { lineHeight: '1.7' }],
        xl: ['20px', { lineHeight: '1.7' }],
        '2xl': ['24px', { lineHeight: '1.8' }],
        '3xl': ['30px', { lineHeight: '1.8' }],
        '4xl': ['36px', { lineHeight: '1.9' }],
        '5xl': ['48px', { lineHeight: '1.9' }],
      },
      lineHeight: {
        tight: '1.5',
        normal: '1.6',
        relaxed: '1.75',
        loose: '2',
      },
      letterSpacing: {
        normal: '0',
        tight: '-0.02em',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        base: '4px',
        lg: '8px',
      },
    },
  },
  plugins: [],
};

export default config;
