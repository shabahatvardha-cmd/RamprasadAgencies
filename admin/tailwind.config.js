/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#F9F6F0',
          200: '#F5F2EB',
          300: '#EFECE6',
          400: '#E2DCD2',
          500: '#D5CDBF',
        },
        charcoal: {
          950: '#0F0F10',
          900: '#141415',
          850: '#1A1A1A',
          800: '#222222',
          750: '#2A2A2A',
          700: '#333333',
        },
        brass: {
          300: '#E4CF99',
          400: '#D6B86F',
          500: '#C5A059',
          600: '#AD863E',
          700: '#8C6826',
          800: '#714D11',
        },
        rust: {
          400: '#D4744E',
          500: '#B85A38',
          600: '#9E472A',
          700: '#7F341C',
        },
        forest: {
          800: '#1B382B',
          900: '#13281E',
          950: '#0C1C14',
        },
        gold: {
          50: '#fffbf0',
          100: '#fef5d6',
          200: '#fde5a8',
          300: '#fcd071',
          400: '#f9b83b',
          500: '#d4af37',
          600: '#b8860b',
          700: '#8c610d',
          800: '#714d11',
          900: '#5e3e13',
        },
        obsidian: {
          950: '#070a0f',
          900: '#0d131d',
          850: '#111927',
          800: '#162032',
          700: '#1f2d42',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
