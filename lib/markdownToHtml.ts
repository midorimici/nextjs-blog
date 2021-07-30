import remark from 'remark'
import html from 'remark-html'

export default async function markdownToHtml(markdown: string) {
  const parseMarkdown = markdown
    .replace(/<pstlk label="(.+?)" to=".+?" \/>/g, '$1')
    .replace(/<tltp label="(.+)">(?:(?:.|\s)+)<\/tltp>/, '$1')
  const result = await remark().use(html).process(parseMarkdown)
  return result.toString()
}
