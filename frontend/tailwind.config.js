/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Natural Vintage-inspired Luxury Palette (Fossil Aesthetic)
        cream: {
          50: '#FDFCF9',
          100: '#F9F6F0', // Primary Warm Ivory / Cream
          200: '#F5F2EB', // Soft Beige
          300: '#EFECE6', // Muted Parchment
          400: '#E2DCD2',
          500: '#D5CDBF',
        },
        charcoal: {
          950: '#0F0F10',
          900: '#141415',
          850: '#1A1A1A', // Deep Charcoal requested
          800: '#222222',
          750: '#2A2A2A',
          700: '#333333',
        },
        brass: {
          300: '#E4CF99',
          400: '#D6B86F',
          500: '#C5A059', // Antique Brass / Brushed Gold
          600: '#AD863E',
          700: '#8C6826',
        },
        rust: {
          400: '#D4744E',
          500: '#B85A38', // Burnt Sienna / Rust
          600: '#9E472A',
          700: '#7F341C',
        },
        forest: {
          800: '#1B382B', // Deep Forest Green hint
          900: '#13281E',
          950: '#0C1C14',
        },
        obsidian: {
          950: '#0B0B0D',
          900: '#121214',
          850: '#1A1A1E',
          800: '#24242A',
          700: '#32323A',
        },
        gold: {
          50: '#FDFBF5',
          100: '#F8F2E2',
          200: '#F3E5AB',
          300: '#E7CF7B',
          400: '#DEB94C',
          500: '#C5A059', // Brushed Antique Gold
          600: '#B8860B',
          700: '#946606',
          800: '#774F0C',
        },
      },
      fontFamily: {
        serif: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 32s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
      },
    },
  },
  plugins: [],
}
