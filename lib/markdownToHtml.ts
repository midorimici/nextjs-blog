import { unified } from 'unified'
import remarkParse from 'remark-parse/lib'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify/lib'

export type Options = {
  minimum?: boolean
  targetBlank?: boolean
  removeP?: boolean
  removePBeforehand?: boolean
}

export async function markdownToHtml(
  markdown: string,
  { minimum = true, targetBlank = true, removeP = true, removePBeforehand = false }: Options = {}
) {
  let parseMarkdown = minimum
    ? markdown
        .replace(/<pstlk label=["'](.+?)["'] to=["'].+?["'] \/>/g, '$1')
        .replace(/<tltp label=["'](.+)["']>(?:(?:.|\n)+)<\/tltp>/g, '$1')
    : markdown
  if (removePBeforehand) parseMarkdown = parseMarkdown.replace(/<p>([\s\S]*?)<\/p>/g, '$1')
  const parsedMd = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(parseMarkdown)
  let result = String(parsedMd)
  if (targetBlank)
    result = result.replace(/<a (.*?)>/g, '<a $1 target="_blank" rel="noopener noreferrer">')
  if (removeP) result = result.replace(/<p>([\s\S]*?)<\/p>/g, '$1')
  return result.replace(/(<\/?)i(code>)/g, '$1$2')
}
