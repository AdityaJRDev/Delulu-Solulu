/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08060c',
          900: '#0d0a13',
          850: '#120e1b',
          800: '#171223',
          700: '#221a33',
          600: '#332748',
        },
        cream: {
          50: '#FFFCF6',
          100: '#FBF3E4',
          200: '#F3E6CE',
          300: '#E7D3B2',
        },
        maroon: {
          500: '#7A2342',
          600: '#6B1B3A',
          700: '#5E1B33',
          800: '#4A0F26',
        },
        navy: {
          500: '#2E4A7C',
          600: '#243A63',
          700: '#1C2E4F',
        },
        teal: {
          500: '#187A70',
          600: '#12615A',
          700: '#0E4E48',
        },
        gold: {
          300: '#F4D28A',
          400: '#E9BC63',
          500: '#D9A441',
          600: '#B8862F',
        },
        ember: {
          200: '#FFC2CE',
          300: '#FF9FB2',
          400: '#FF8097',
          500: '#E23A5E',
          600: '#C22B4C',
        },
        plum: {
          400: '#A78BFA',
          500: '#8B5CF6',
        },
        mint: {
          400: '#5EEAD4',
          500: '#2DD4BF',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(139,92,246,0.45)',
        card: '0 24px 60px -24px rgba(0,0,0,0.8)',
        pill: 'inset 0 1px 0 rgba(255,240,205,0.28), 0 10px 24px -10px rgba(0,0,0,0.9)',
      },
      keyframes: {
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-18px,0) scale(1.04)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        drift: 'drift 14s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        pulseSoft: 'pulseSoft 2.6s ease-in-out infinite',
        pop: 'pop 380ms cubic-bezier(0.2,0.8,0.2,1) both',
      },
    },
  },
  plugins: [],
}
