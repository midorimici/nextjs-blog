import { AppProps } from 'next/app'
import { Prism } from 'prism-react-renderer'

import 'styles/index.css'

declare global {
  namespace NodeJS {
    interface Global {
      Prism: any
    }
  }
}
declare global {
  interface Window {
    Prism: any
  }
};

(typeof global !== 'undefined' ? global : window).Prism = Prism

require('prismjs/components/prism-docker')
require('prismjs/components/prism-powershell')
require('prismjs/components/prism-ruby')
require('prismjs/components/prism-toml')
require('prismjs/components/prism-vim')

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
