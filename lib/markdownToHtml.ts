import remark from 'remark'
import html from 'remark-html'

export type Options = {
  minimum?: boolean
  targetBlank?: boolean
}

export async function markdownToHtml(markdown: string, {
  minimum = true,
  targetBlank = true,
}: Options = {}) {
  const parseMarkdown = minimum
    ? markdown.replace(/<pstlk label=["'](.+?)["'] to=["'].+?["'] \/>/g, '$1')
      .replace(/<tltp label=["'](.+)["']>(?:(?:.|\n)+)<\/tltp>/g, '$1')
    : markdown
  const result = await remark().use(html).process(parseMarkdown)
  if (targetBlank) return result.toString().replace(/<a (.*?)>/g, '<a $1 target="_blank" rel="noopener noreferrer">')
  return result.toString()
}
