import { createClient } from 'contentful'
import type { Entry, EntryCollection } from 'contentful'
import twemoji from 'twemoji'

import type { ContentfulTopicFields, ContentfulPostFields, ContentfulAboutPostFields } from 'types/api'

const client = createClient({
  space: process.env.ctfSpaceId ?? '',
  environment: process.env.ctfEnvId,
  accessToken: process.env.ctfPreviewAccessToken || process.env.ctfAccessToken || '',
  host: process.env.ctfPreviewAccessToken ? 'preview.contentful.com' : 'cdn.contentful.com'
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
  const entry: Entry<ContentfulAboutPostFields> = await client.getEntry(process.env.ctfAboutEntryId ?? '')
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
    content_type: 'blogPost',
    select: fields.map(field => `fields.${field}`).join(','),
    order: '-fields.date',
    limit: 500,
  })
  return entries.items.map(item => item.fields)
}

export async function getTotalPostNumbers() {
  const entries: EntryCollection<ContentfulPostFields> = await client.getEntries({
    content_type: 'blogPost',
    limit: 500,
  })
  return entries.total
}


export async function getTopics() {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: 'topic',
  })
  return topics.items.map(item => item.fields)
}

export async function getTopicLabelFromId(id: string) {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: 'topic',
    'fields.id': id,
    select: 'fields.label',
  })
  return topics.items[0].fields.label
}

export async function getPostNumbersByTopics() {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: 'topic',
  })
  const entries: EntryCollection<Pick<ContentfulPostFields, 'topics'>> = await client.getEntries({
    content_type: 'blogPost',
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
