/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      '2xl': { 'max': '1535px' },

      'xl': { 'max': '1335px' },

      'lg': { 'max': '1200px' },

      'md': { 'max': '800px' },

      'sm': { 'max': '639px' },
    }
  },
  plugins: [],
}