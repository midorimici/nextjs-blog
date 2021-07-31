import { useState, useEffect, ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'

import Tooltip from './mdx/tltp'
import markdownToHtml from '../lib/markdownToHtml'

export const useParsedMarkdown = (markdown: string | ReactElement, minimum: boolean = true) => {
  const [content, setContent] = useState('')

  useEffect(() => {
    parseMarkdown()
  }, [])

  const parseMarkdown = async () => {
    const md = typeof markdown === 'string' ? markdown : ReactDOMServer.renderToStaticMarkup(markdown)
    let html = await markdownToHtml(md, minimum)
    html = minimum ? html : await tltpReplaced(html)
    setContent(html.replace(/<p>([\s\S]*)<\/p>/, '$1'))
  }

  const tltpReplaced = async (str: string) => {
    let result = str
    const regex = /<tltp label=["'](.+)["']>((?:.|\n)+)<\/tltp>/
    const regexg = RegExp(regex, 'g')
    let ex: string[] | null;
    while ((ex = regexg.exec(str)) !== null) {
      const label = ex[1]
      const children = (await markdownToHtml(ex[2])).replace(/<p>([\s\S]*)<\/p>/, '$1')
      const tltp = ReactDOMServer.renderToStaticMarkup(<Tooltip label={label} children={children} />)
      result = result.replace(regex, (await markdownToHtml(tltp))
        .replace(/(<span class="tooltip">)(<\/span>)/, `$1${children}$2`)
        .replace(/<p>([\s\S]*)<\/p>/, '$1')
      )
    }
    return result
  }

  return content
}
