type PostType = {
  slug: string
  title: string
  date: string
  lastmod: string
  tags: string[]
  content: string
  summary?: string
  draft?: boolean
}

export default PostType
