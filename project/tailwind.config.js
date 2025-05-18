import { type Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4e7',
          100: '#fbe8cf',
          200: '#f7d19f',
          300: '#f3ba6f',
          400: '#efa33f',
          500: '#eb8c0f',
          600: '#bc700c',
          700: '#8d5409',
          800: '#5e3806',
          900: '#2f1c03',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config