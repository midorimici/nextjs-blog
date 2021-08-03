module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#FAFAFA',
        'accent-2': '#EAEAEA',
        'accent-7': '#333',
        success: '#0070f3',
        cyan: '#79FFE1',
        yellowgreen: 'yellowgreen',
      },
      spacing: {
        28: '7rem',
      },
      letterSpacing: {
        tighter: '-.04em',
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem',
      },
      fontFamily: {
        'code': ['"Fira Code"', '"Source Code Pro"']
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
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
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
