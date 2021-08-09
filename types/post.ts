type PostType = {
  slug: string
  title: string
  date: string
  lastmod: string
  tags: string[]
  content: string
  katex?: boolean
  summary?: string
  published?: boolean
}

export default PostType
