import { createClient } from 'contentful'
import type { Entry, EntryCollection } from 'contentful'
import twemoji from 'twemoji'

import type { ContentfulTopicFields, ContentfulPostFields, ContentfulAboutPostFields } from 'types/api'
import {
  CTF_ACCESS_TOKEN,
  CTF_PREVIEW_ACCESS_TOKEN,
  CTF_SPACE_ID,
  CTF_ENV_ID,
  CTF_POST_CONTENT_TYPE_ID,
  CTF_TOPIC_CONTENT_TYPE_ID,
  CTF_ABOUT_ENTRY_ID,
} from './constants'

const client = createClient({
  space: CTF_SPACE_ID,
  environment: CTF_ENV_ID,
  accessToken: CTF_PREVIEW_ACCESS_TOKEN || CTF_ACCESS_TOKEN,
  host: CTF_PREVIEW_ACCESS_TOKEN ? 'preview.contentful.com' : 'cdn.contentful.com'
})

export const necessaryFieldsForPostList: (keyof ContentfulPostFields)[] = [
  'slug',
  'title',
  'date',
  'lastmod',
  'topics',
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
  'assets',
  'summary',
  'content',
]

export async function getAboutPost() {
  const entry: Entry<ContentfulAboutPostFields> = await client.getEntry(CTF_ABOUT_ENTRY_ID)
  return {
    title: entry.fields.title,
    profileUrl: `https:${entry.fields.profile.fields.file.url}`,
    content: twemoji.parse(entry.fields.content),
  }
}

export async function getAllPosts(fields: (keyof ContentfulPostFields)[]) {
  const entries: EntryCollection<
    Pick<ContentfulPostFields, (typeof fields)[number]>
  > = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: fields.map(field => `fields.${field}`).join(','),
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


export async function getTopics() {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: CTF_TOPIC_CONTENT_TYPE_ID,
  })
  return topics.items.map(item => item.fields)
}

export async function getTopicLabelFromId(id: string) {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: CTF_TOPIC_CONTENT_TYPE_ID,
    'fields.id': id,
    select: 'fields.label',
  })
  return topics.items[0].fields.label
}

export async function getPostNumbersByTopics() {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: CTF_TOPIC_CONTENT_TYPE_ID,
  })
  const entries: EntryCollection<Pick<ContentfulPostFields, 'topics'>> = await client.getEntries({
    content_type: CTF_POST_CONTENT_TYPE_ID,
    select: 'fields.topics',
    limit: 500,
  })
  const topicNumberMap: Record<string, { count: number, topic: ContentfulTopicFields }> = {}
  for (const topic of topics.items) {
    topicNumberMap[topic.fields.id] = {
      count: entries.items.filter(entry => {
        const entryTopics = entry.fields.topics
        return entryTopics && entryTopics.some((postTopic) => (
          postTopic.fields.id === topic.fields.id
        ))
      }).length,
      topic: topic.fields,
    }
  }
  const sortedTopicNumberMap = Object.fromEntries(
    Object.entries(topicNumberMap).sort((a, b) => b[1].count - a[1].count)
  )
  return sortedTopicNumberMap
}
