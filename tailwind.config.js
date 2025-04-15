module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'coffee': '#EFCCB9',
        'tea': '#C9EA94',
        'soft-drink': '#FFE665',
        'milkshake': '#F9ECD2',
        'coffee-bg': '#EFCCB9',
        'tea-bg': '#C9EA94',
        'soft-drinks-bg': '#FFE665',
        'milkshake-bg': '#F9ECD2'
      },
      strokeColor: {
        'coffee': '#EFCCB9',
        'tea': '#C9EA94',
        'soft-drink': '#FFE665',
        'milkshake': '#F9ECD2'
      },
      width: {
        'kiosk': '480px'
      },
      height: {
        'kiosk': '800px'
      },
      borderRadius: {
        '4xl': '14px'
      },
      fontSize: {
        'xs': '0.75rem', // 12px
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
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)'
          },
          '60%': {
            opacity: '1',
            transform: 'scale(1.05)'
          },
          '100%': {
            transform: 'scale(1)'
          }
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
        'bounce-in': 'bounce-in 0.8s ease',
        pulse: 'pulse 2s infinite'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
} 