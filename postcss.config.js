const purgecssOption = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    ...['xs' , 'sm' , 'base' , 'lg' , 'xl' , '2xl'].map(size => `md:text-${size}`),
    '-z-10',
  ],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
}

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')(purgecssOption),
    require('cssnano')({
      preset: 'default',
    }),
  ],
}
