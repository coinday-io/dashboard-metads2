import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { navy: '#01083c', ink: '#0f172a', meta: '#0866ff' },
      boxShadow: { soft: '0 18px 55px rgba(15, 23, 42, 0.08)' },
      fontFamily: { sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'] },
    },
  },
  plugins: [],
};

export default config;
