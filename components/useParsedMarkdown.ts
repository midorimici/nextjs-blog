import { useState, useEffect } from 'react'
import markdownToHtml from '../lib/markdownToHtml'

export const useParsedMarkdown = (markdown: string) => {
  const [content, setContent] = useState('')

  useEffect(() => {
    parseMarkdown()
  }, [])

  const parseMarkdown = async () => {
    const html = await markdownToHtml(markdown)
    setContent(html.replace(/^<p>([\s\S]*)<\/p>$/, '$1'))
  }

  return content
}
