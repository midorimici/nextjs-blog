import { useState, useEffect, ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'

import Tooltip from './mdx/tltp'
import { markdownToHtml, Options } from 'lib/markdownToHtml'

export const useParsedMarkdown = (markdown: string | ReactElement, {
  minimum = true,
  targetBlank = true,
}: Options = {}) => {
  const [content, setContent] = useState('')

  useEffect(() => {
    const parseMarkdown = async () => {
      const md = typeof markdown === 'string' ? markdown : ReactDOMServer.renderToStaticMarkup(markdown)
      let html = await markdownToHtml(md, { minimum, targetBlank })
      html = minimum ? html : await tltpReplaced(html)
      html = html.replace(/<p>([\s\S]*?)<\/p>/g, '$1')
      return html
    }

    let isSubscribed = true
    parseMarkdown().then((html: string) => {
      if (isSubscribed) setContent(html)
    })
    return () => { isSubscribed = false }
  }, [markdown, minimum, targetBlank])

  const tltpReplaced = async (str: string) => {
    let result = str
    const regex = /<tltp label=["'](.+)["']>((?:.|\n)+)<\/tltp>/
    const regexg = RegExp(regex, 'g')
    let ex: string[] | null;
    while ((ex = regexg.exec(str)) !== null) {
      const label = ex[1]
      const children = (await markdownToHtml(ex[2])).replace(/<p>([\s\S]*)<\/p>/, '$1')
      const tltp = ReactDOMServer.renderToStaticMarkup(<Tooltip label={label}>{children}</Tooltip>)
      result = result.replace(regex, (await markdownToHtml(tltp))
        .replace(/(<span class="tooltip">)(<\/span>)/, `$1${children}$2`)
        .replace(/<p>([\s\S]*)<\/p>/, '$1')
      )
    }
    return result
  }

  return content
}
