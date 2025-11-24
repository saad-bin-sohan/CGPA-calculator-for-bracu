import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0b63f6',
        accent: '#0fc0c3'
      }
    }
  },
  plugins: []
};

export default config;
