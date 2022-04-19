module.exports = {
  purge: {
    content: ['./components/**/*.tsx', './pages/**/*.tsx'],
    safelist: [
      ...['xs', 'sm', 'base', 'lg', 'xl', '2xl'].map((size) => `md:text-${size}`),
      '-z-10',
      'top-full',
      ...['yellow', 'red', 'green']
        .map((color) => [
          `bg-${color}-100`,
          `bg-${color}-800`,
          `from-${color}-50`,
          `from-${color}-900`,
          `border-${color}-300`,
        ])
        .flat(),
    ],
  },
  theme: {
    extend: {
      fontSize: {
        '4xl': ['2.25rem', '3.5rem'],
        '5xl': '2.5rem',
      },
      fontFamily: {
        code: ['"Fira Code"', '"Source Code Pro"'],
      },
      cursor: {
        'zoom-out': 'zoom-out',
      },
      minWidth: {
        'fill-available': ['-webkit-fill-available', '-moz-available'],
      },
      zIndex: {
        '-10': '-10',
      },
      keyframes: {
        rotate: {
          '0%': {
            color: '#0000f0',
            transform: 'scale(1.0) rotate(0)',
          },
          '20%': {
            color: '#f00000',
          },
          '40%': {
            color: '#f0f000',
          },
          '50%': {
            transform: 'scale(1.5) rotate(360deg)',
          },
          '60%': {
            color: '#f0f000',
          },
          '80%': {
            color: '#00f0f0',
          },
          '100%': {
            color: '#0000f0',
            transform: 'scale(1.0) rotate(720deg)',
          },
        },
      },
      animation: {
        rotate: 'rotate 6s cubic-bezier(0.5, 0.5, 0.5, 0.5) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
