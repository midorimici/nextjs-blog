import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import twemoji from 'twemoji'

import { PAGINATION_PER_PAGE } from './constants'

const postsDirectory = join(process.cwd(), 'public/posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const fullPath = join(postsDirectory, `${slug}/index.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = slug
    }
    if (field === 'content') {
      items[field] = twemoji.parse(content)
    }
    if (field === 'date' || field === 'lastmod') {
      items[field] = data[field].toISOString()
    } else if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}

export function getAboutPost() {
  const fileContents = fs.readFileSync(join(process.cwd(), 'public/about/index.md'), 'utf8')
  const { data, content } = matter(fileContents)

  return { title: data.title, content: twemoji.parse(content) }
}

export function getPosts(fields: string[] = [], offset: number = 0, limit: number = PAGINATION_PER_PAGE) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
    .slice(offset, offset+limit)
  return posts
}

export function getTotalPostNumbers() {
  return getPostSlugs().length
}
