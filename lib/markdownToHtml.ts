import remark from 'remark'
import html from 'remark-html'

export type Options = {
  minimum?: boolean
  targetBlank?: boolean
  removeP?: boolean
}

export async function markdownToHtml(markdown: string, {
  minimum = true,
  targetBlank = true,
  removeP = true,
}: Options = {}) {
  const parseMarkdown = minimum
    ? markdown.replace(/<pstlk label=["'](.+?)["'] to=["'].+?["'] \/>/g, '$1')
      .replace(/<tltp label=["'](.+)["']>(?:(?:.|\n)+)<\/tltp>/g, '$1')
    : markdown
  const parsedMd = await remark().use(html).process(parseMarkdown)
  let result = parsedMd.toString()
  if (targetBlank) result = result.replace(/<a (.*?)>/g, '<a $1 target="_blank" rel="noopener noreferrer">')
  if (removeP) result = result.replace(/<p>([\s\S]*?)<\/p>/g, '$1')
  return result.replace(/(<\/?)i(code>)/g, '$1$2')
}
