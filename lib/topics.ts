import twemoji from 'twemoji'

type BrandTopicsMap = Record<string, { label: string, logo: string }>

export const brandTopicsMap: BrandTopicsMap = {
  docker: {
    label: 'Docker',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg',
  },
  adsense: {
    label: 'Google Adsense',
    logo: 'https://api.iconify.design/logos-google-adsense.svg',
  },
  heroku: {
    label: 'Heroku',
    logo: 'https://github.com/devicons/devicon/raw/master/icons/heroku/heroku-original.svg',
  },
  html: {
    label: 'HTML',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg',
  },
  hugo: {
    label: 'Hugo',
    logo: 'https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/layouts/partials/svg/hugo-h-only.svg',
  },
  javascript: {
    label: 'JavaScript',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg',
  },
  materialui: {
    label: 'Material-UI',
    logo: 'https://github.com/mui-org/material-ui/raw/next/docs/public/static/logo.svg',
  },
  netlify: {
    label: 'Netlify',
    logo: 'https://api.iconify.design/logos-netlify.svg',
  },
  opengl: {
    label: 'OpenGL',
    logo: 'https://api.iconify.design/logos-opengl.svg',
  },
  python: {
    label: 'Python',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg',
  },
  rails: {
    label: 'Rails',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/rails/rails-plain-wordmark.svg',
  },
  react: {
    label: 'React',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
  },
  recoil: {
    label: 'Recoil',
    logo: 'https://github.com/facebookexperimental/Recoil/raw/docs/logo/SVG/logo.svg',
  },
  svelte: {
    label: 'Svelte',
    logo: 'https://raw.githubusercontent.com/sveltejs/svelte/master/site/static/svelte-logo.svg',
  },
  typescript: {
    label: 'TypeScript',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
  },
  vim: {
    label: 'Vim',
    logo: 'https://github.com/devicons/devicon/raw/master/icons/vim/vim-original.svg',
  },
  vscode: {
    label: 'VSCode',
    logo: 'https://github.com/devicons/devicon/raw/master/icons/vscode/vscode-original.svg',
  },
}

const topicEmojiMap: Record<string, string> = {
  'アプリ開発': '🏗️',
  '歌': '🎤',
  'エンジニア': '💻',
  '言語': '🔤',
  '声': '🎶',
  'こころ': '❤️',
  'サイト構築': '🌐',
  'チェス': '♟️',
  'ツール': '🔨',
  'ひとりごと': '😷',
  'ブログ': '📰',
  'プログラミング': '🤖',
  'マンガ': '📖',
}

let topicEmojiSourceMap: Record<string, string> = {}

for (const [k, v] of Object.entries(topicEmojiMap)) {
  topicEmojiSourceMap[k] = `https://twemoji.maxcdn.com/v/latest/svg/${twemoji.convert.toCodePoint(v).split('-')[0]}.svg`
}

export { topicEmojiSourceMap }

export const topicNames = Object.keys(brandTopicsMap).concat(Object.keys(topicEmojiMap))
