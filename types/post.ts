type PostType = {
  slug: string
  title: string
  date: string
  lastmod: string
  tags: string[]
  content: string
  katex?: boolean
  summary?: string
  draft?: boolean
}

export default PostType
