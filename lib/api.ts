import { createClient } from 'contentful'
import type { Entry, EntryCollection } from 'contentful'
import twemoji from 'twemoji'

import type { ContentfulPostFields, ContentfulAboutPostFields } from 'types/api'
import {
  CTF_ACCESS_TOKEN,
  CTF_SPACE_ID,
  CTF_ENV_ID,
  CTF_POST_CONTENT_TYPE_ID,
  CTF_ABOUT_ENTRY_ID,
  PAGINATION_PER_PAGE,
} from './constants'

const client = createClient({
  space: CTF_SPACE_ID,
  environment: CTF_ENV_ID,
  accessToken: CTF_ACCESS_TOKEN,
})

export const necessaryFieldsForPostList: (keyof ContentfulPostFields)[] = [
  'slug',
  'title',
  'date',
  'lastmod',
  'topics',
  'published',
  'assets',
  'summary',
  'content',
]

export const necessaryFieldsForPost: (keyof ContentfulPostFields)[] = [
  'slug',
  'title',
  'date',
  'lastmod',
  'topics',
  'katex',
  'published',
  'assets',
  'summary',
  'content',
]

export async function getPostSlugs() {
  const entries: EntryCollection<Pick<ContentfulPostFields, 'slug'>> = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: 'fields.slug',
    limit: 500,
  })
  return entries.items.map(item => item.fields.slug)
}

export async function getPostBySlug(slug: string, fields: (keyof ContentfulPostFields)[]) {
  const entries: EntryCollection<Pick<ContentfulPostFields, (typeof fields)[number]>> = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    'fields.slug': slug,
    select: fields.map(field => `fields.${field}`).join(','),
  })
  return entries.items[0].fields
}

export async function getAboutPost() {
  const entry: Entry<ContentfulAboutPostFields> = await client.getEntry(CTF_ABOUT_ENTRY_ID)
  return {
    title: entry.fields.title,
    profileUrl: `https:${entry.fields.profile.fields.file.url}`,
    content: twemoji.parse(entry.fields.content),
  }
}

export async function getPosts(
  fields: (keyof ContentfulPostFields)[],
  { offset = 0, limit = PAGINATION_PER_PAGE }: {
    offset?: number,
    limit?: number,
  } = {}
) {
  const entries: EntryCollection<
    Pick<ContentfulPostFields, (typeof fields)[number]>
  > = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: fields.map(field => `fields.${field}`).join(','),
    order: '-fields.date',
    limit,
    skip: offset,
  })
  return entries.items.map(item => item.fields)
}

export async function getAllPosts() {
  const entries: EntryCollection<
    Pick<ContentfulPostFields, (typeof necessaryFieldsForPostList)[number]>
  > = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: necessaryFieldsForPostList.map(field => `fields.${field}`).join(','),
    order: '-fields.date',
    limit: 500,
  })
  return entries.items.map(item => item.fields)
}

export async function getTotalPostNumbers() {
  const entries: EntryCollection<ContentfulPostFields> = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    limit: 500,
  })
  return entries.total
}

export async function getPostNumbersByTopics(topics: string[]) {
  const entries: EntryCollection<Pick<ContentfulPostFields, 'topics'>> = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: 'fields.topics',
    limit: 500,
  })
  const topicNumberMap: Record<string, number> = {}
  for (const topic of topics) {
    topicNumberMap[topic] = entries.items.filter(entry => {
      const entryTopics = entry.fields.topics
      return entryTopics && entryTopics.some((postTopic: string) => (
        postTopic.toLowerCase() === topic.toLowerCase()
      ))
    }).length
  }
  const sortedTopicNumberMap = Object.fromEntries(
    Object.entries(topicNumberMap).sort((a, b) => b[1] - a[1])
  )
  return sortedTopicNumberMap
}

export async function getPostsByTopic(topic: string) {
  const entries: EntryCollection<
    Pick<ContentfulPostFields, (typeof necessaryFieldsForPostList)[number]>
  > = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: necessaryFieldsForPostList.map(field => `fields.${field}`).join(','),
    'fields.topics': topic,
    order: '-fields.date',
  })
  return entries.items.map(item => item.fields)
}
