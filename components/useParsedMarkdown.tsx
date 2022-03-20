import { useState, useEffect, ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'

import { markdownToHtml, Options } from 'lib/markdownToHtml'

export const useParsedMarkdown = (
  markdown: string | ReactElement,
  { minimum = true, targetBlank = true }: Options = {}
) => {
  const [content, setContent] = useState('')

  useEffect(() => {
    const parseMarkdown = async () => {
      const md =
        typeof markdown === 'string' ? markdown : ReactDOMServer.renderToStaticMarkup(markdown)
      let html = await markdownToHtml(md, { minimum, targetBlank })
      html = html.replace(/<p>([\s\S]*?)<\/p>/g, '$1')
      return html
    }

    let isSubscribed = true
    parseMarkdown().then((html: string) => {
      if (isSubscribed) setContent(html)
    })
    return () => {
      isSubscribed = false
    }
  }, [markdown, minimum, targetBlank])

  return content
}
