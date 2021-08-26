import { createClient } from 'contentful'
import type { Entry, EntryCollection } from 'contentful'
import { parseISO, format } from 'date-fns'
import markdownTOC from 'markdown-toc'
import twemoji from 'twemoji'

import type {
  ContentfulTopicFields,
  ContentfulPostFields,
  ContentfulAboutPostFields,
  PostFieldsToIndex,
  PostFieldsToShow,
} from 'types/api'
import { PAGINATION_PER_PAGE, HOME_OG_IMAGE_URL } from './constants'
import { markdownToHtml } from './markdownToHtml'

const POST_CONTENT_TYPE = 'blogPost'
const TOPIC_CONTENT_TYPE = 'topic'

const client = createClient({
  space: process.env.ctfSpaceId ?? '',
  environment: process.env.ctfEnvId,
  accessToken: process.env.ctfPreviewAccessToken || process.env.ctfAccessToken || '',
  host: process.env.ctfPreviewAccessToken ? 'preview.contentful.com' : 'cdn.contentful.com'
})

export const necessaryFieldsForPostList = [
  'slug',
  'title',
  'date',
  'lastmod',
  'topics',
  'assets',
  'summary',
  'content',
] as const

export const necessaryFieldsForPost = [
  'slug',
  'title',
  'date',
  'lastmod',
  'topics',
  'katex',
  'assets',
  'content',
] as const

export async function getAboutPost() {
  const entry: Entry<ContentfulAboutPostFields> = await client.getEntry(process.env.ctfAboutEntryId ?? '')
  return {
    title: entry.fields.title,
    profileUrl: `https:${entry.fields.profile.fields.file.url}`,
    content: twemoji.parse(entry.fields.content),
  }
}

type ModifiedFieldsReturn<T> = T extends Pick<ContentfulPostFields, 'summary'>
  ? Pick<PostFieldsToIndex, 'title' | 'date' | 'lastmod' | 'topics' | 'coverImageUrl' | 'summary'>
  : Pick<PostFieldsToShow, 'title' | 'date' | 'lastmod' | 'topics' | 'assets' | 'content' | 'toc'>

const modifiedFields = async <
  T extends Pick<ContentfulPostFields, typeof necessaryFieldsForPostList[number]> | Pick<ContentfulPostFields, typeof necessaryFieldsForPost[number]>
>(fields: T): Promise<ModifiedFieldsReturn<T>> => {
  const isPostListFieldKey = (arg: any): arg is Pick<ContentfulPostFields, typeof necessaryFieldsForPostList[number]> => {
    return arg.summary !== undefined
  }
  
  const title = fields.title.replace(/<br\/?>/g, ' ')
  const date = format(parseISO(fields.date), 'yyyy-MM-dd')
  const lastmod = format(parseISO(fields.lastmod), 'yyyy-MM-dd')
  const topics = fields.topics.map(topic => topic.fields)
  if (isPostListFieldKey(fields)) {
    const summaryToShow = (
      fields.summary || fields.content.replace(/([\s\S]+)\n<!--more-->[\s\S]+/, '$1')) + '…'
    const summary = await markdownToHtml(
      twemoji.parse(summaryToShow)
        .replace(/className=/g, 'class=')
        .replace(/<img/g, '<amp-img width="1.5rem" height="1.5rem"'),
      { removeP: false },
    )
    const coverImage = fields.assets?.find(asset => asset.fields.file.fileName === '_index.jpg')
      ?.fields.file.url
    const coverImageUrl = `https:${coverImage ?? HOME_OG_IMAGE_URL.slice(6)}`
    return { title, date, lastmod, topics, coverImageUrl, summary } as ModifiedFieldsReturn<T>
  } else {
    const f = fields as Pick<ContentfulPostFields, typeof necessaryFieldsForPost[number]>
    const assets = f.assets ? Object.fromEntries(
      f.assets.map(asset => [
        asset.fields.file.fileName.split('.')[0], {
          url: `https:${asset.fields.file.url}`,
          size: asset.fields.file.details.image
        }
      ])
    ) : {
      _index: {
        url: HOME_OG_IMAGE_URL,
        size: { width: 640, height: 360 },
      }
    }
    // MDX 通すのでこの段階では markdown 不要
    const content = twemoji.parse(f.content)
      .replace(/className=/g, 'class=')
      .replace(/<img/g, '<amp-img width="1.5rem" height="1.5rem"')
      .replace(/## .+/, '<toc />\n\n$&')
    
    const toc = await markdownToHtml(markdownTOC(content).content, { targetBlank: false })
    
    return { title, date, lastmod, topics, assets, content, toc } as ModifiedFieldsReturn<T>
  }
}

export async function getPosts(
  { offset = 0, limit = PAGINATION_PER_PAGE }: {
    offset?: number,
    limit?: number,
  } = {}
) {
  const entries: EntryCollection<
    Pick<ContentfulPostFields, typeof necessaryFieldsForPostList[number]>
  > = await client.getEntries({
    content_type: POST_CONTENT_TYPE,
    select: necessaryFieldsForPostList.map(field => `fields.${field}`).join(','),
    order: '-fields.date',
    limit,
    skip: offset,
  })
  const entryPosts = entries.items.map(item => item.fields)
  return Promise.all(entryPosts.map(async fields => {
    if (fields.summary === undefined) { fields.summary = '' }
    const modified = await modifiedFields(fields)
    const newFields: PostFieldsToIndex = {
      slug: fields.slug, ...modified
    }
    return newFields
  }))
}

type GetAllPostsReturn<T> = T extends typeof necessaryFieldsForPostList ? PostFieldsToIndex[] : PostFieldsToShow[]

export async function getAllPosts<
  T extends typeof necessaryFieldsForPostList | typeof necessaryFieldsForPost
>(necessaryFields: T): Promise<GetAllPostsReturn<T>> {
  const isPostListFieldKey = (arg: any): arg is typeof necessaryFieldsForPostList => {
    return arg.includes('summary')
  }

  const entries: EntryCollection<Pick<ContentfulPostFields, T[number]>> = await client.getEntries({
    content_type: POST_CONTENT_TYPE,
    select: necessaryFields.map(field => `fields.${field}`).join(','),
    order: '-fields.date',
    limit: 500,
  })
  const entryPosts = entries.items.map(item => item.fields)
  if (isPostListFieldKey(necessaryFields)) {
    return Promise.all(entryPosts.map(async fields => {
      const f = fields as Pick<ContentfulPostFields, typeof necessaryFieldsForPostList[number]>
      if (f.summary === undefined) { f.summary = '' }
      const modified = await modifiedFields(f)
      const newFields: PostFieldsToIndex = {
        slug: f.slug, ...modified
      }
      return newFields
    })) as Promise<GetAllPostsReturn<T>>
  } else {
    return Promise.all(entryPosts.map(async fields => {
      const f = fields as Pick<ContentfulPostFields, typeof necessaryFieldsForPost[number]>
      const modified = await modifiedFields(f)
      const newFields: PostFieldsToShow = {
        slug: f.slug, katex: f.katex, ...modified
      }
      return newFields
    })) as any
  }
}

export async function getTotalPostNumbers() {
  const entries: EntryCollection<ContentfulPostFields> = await client.getEntries({
    content_type: POST_CONTENT_TYPE,
    limit: 500,
  })
  return entries.total
}


export async function getTopics() {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: TOPIC_CONTENT_TYPE,
  })
  return topics.items.map(item => item.fields)
}

export async function getTopicLabelFromId(id: string) {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: TOPIC_CONTENT_TYPE,
    'fields.id': id,
    select: 'fields.label',
  })
  return topics.items[0].fields.label
}

export async function getPostNumbersByTopics() {
  const topics: EntryCollection<ContentfulTopicFields> = await client.getEntries({
    content_type: TOPIC_CONTENT_TYPE,
  })
  const entries: EntryCollection<Pick<ContentfulPostFields, 'topics'>> = await client.getEntries({
    content_type: POST_CONTENT_TYPE,
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


export async function getPostBySlug(slug: string) {
  const entries: EntryCollection<Pick<ContentfulPostFields, typeof necessaryFieldsForPost[number]>> = await client.getEntries({
    content_type: POST_CONTENT_TYPE,
    'fields.slug': slug,
    select: necessaryFieldsForPost.map(field => `fields.${field}`).join(','),
  })
  const entryPost = entries.items[0].fields
  const modified = await modifiedFields(entryPost)
  const newFields: PostFieldsToShow = {
    slug: entryPost.slug, katex: entryPost.katex, ...modified
  }
  return newFields
}

export async function getRelatedPosts(content: string) {
  const posts = await getAllPosts(necessaryFieldsForPostList)
  let relatedPosts: Record<string, { title: string, coverImageUrl: string }> = {}
  const relatedPostSlugsMatches = content.matchAll(/<relpos link="(.+?)" \/>/g)
  for (const match of relatedPostSlugsMatches) {
    const slug = match[1]
    const titleAndAssets = posts.find(post => post.slug === slug)
    if (titleAndAssets) {
      relatedPosts[slug] = {
        title: titleAndAssets.title,
        coverImageUrl: titleAndAssets.coverImageUrl
      }
    }
  }
  return relatedPosts
}
