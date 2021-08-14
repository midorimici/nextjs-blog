import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import twemoji from 'twemoji'

import type PostType from 'types/post'
import { PAGINATION_PER_PAGE } from './constants'

export const necessaryFieldsForPostList: (keyof PostType)[] = [
  'title',
  'date',
  'slug',
  'summary',
  'lastmod',
  'topics',
  'content',
  'published',
]

export const necessaryFieldsForPost: (keyof PostType)[] = [
  'title',
  'date',
  'slug',
  'summary',
  'lastmod',
  'topics',
  'katex',
  'content',
  'published',
]

const postsDirectory = join(process.cwd(), 'public/posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export function getPostBySlug(slug: string, fields: (keyof PostType)[] = []) {
  if (fs.readdirSync(process.cwd()).length < 6)
    console.log(fs.readdirSync(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/public/posts/${slug}`))
  const fullPath = join(postsDirectory, `${slug}/index.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items: Partial<PostType> = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = slug
    }
    if (field === 'content') {
      items[field] = twemoji.parse(content).replace(/class="emoji"/g, 'className="emoji"')
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

export function getPosts(
  fields: (keyof PostType)[] = [],
  { offset = 0, all = false, limit = PAGINATION_PER_PAGE }: {
    offset?: number,
    all?: boolean,
    limit?: number,
  } = {}
) {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date && post2.date && post1.date > post2.date ? -1 : 1))

  if (all) return posts
  return posts.slice(offset, offset+limit)
}

export function getTotalPostNumbers() {
  return getPostSlugs().length
}

export function getPostNumbersByTopics(topics: string[]) {
  const topicNumberMap: Record<string, number> = {}
  for (const topic of topics) {
    topicNumberMap[topic] = getPosts(['topics'], { all: true })
      .filter(post => post.topics && post.topics.some((postTopic: string) => (
        postTopic.toLowerCase() === topic.toLowerCase()
      ))).length
  }
  const sortedTopicNumberMap = Object.fromEntries(
    Object.entries(topicNumberMap).sort((a, b) => b[1] - a[1])
  )
  return sortedTopicNumberMap
}

export function getPostsByTopic(topic: string) {
  return getPosts(necessaryFieldsForPostList, { all: true })
    .filter(post => post.topics && post.topics.some((postTopic: string) => (
      postTopic.toLowerCase() === topic.toLowerCase()
    )))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date && post2.date && post1.date > post2.date ? -1 : 1))
}
