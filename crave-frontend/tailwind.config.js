/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
      },
      colors: {
        // Haute Cuisine Luxury Palette: Deep Emerald, Burnished Gold & Warm Truffle
        emerald: {
          850: '#064434',
          950: '#02261d',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        truffle: {
          50: '#fcfbf9',
          100: '#f6f3eb',
          200: '#ece5d7',
          300: '#ded3bf',
          400: '#c5b497',
          500: '#a89474',
          600: '#8a7657',
          700: '#6f5e44',
          800: '#584b37',
          900: '#463c2c',
        }
      }
    },
  },
  plugins: [],
}
