module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'coffee': '#FFD600',
        'tea': '#8FD14F',
        'soft-drink': '#FFFFFF',
        'milkshake': '#FF9BCD'
      },
      width: {
        'kiosk': '480px'
      },
      height: {
        'kiosk': '800px'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        pulse: {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)'
          },
          '50%': {
            opacity: 0.7,
            transform: 'scale(1.05)'
          }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 1s ease',
        'slide-in-right': 'slide-in-right 1s ease',
        'fade-in': 'fade-in 1s ease',
        pulse: 'pulse 2s infinite'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} 