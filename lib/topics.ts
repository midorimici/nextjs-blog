import twemoji from 'twemoji'

type BrandTopicsMap = Record<string, { label: string, logo: string }>

export const brandTopicsMap: BrandTopicsMap = {
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
  react: {
    label: 'React',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg',
  },
  typescript: {
    label: 'TypeScript',
    logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg',
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

let topicEmojiSourceMap: Record<string, string> = {};

for (const [k, v] of Object.entries(topicEmojiMap)) {
  topicEmojiSourceMap[k] = `https://twemoji.maxcdn.com/v/latest/svg/${twemoji.convert.toCodePoint(v).split('-')[0]}.svg`
}

export { topicEmojiSourceMap }
