import Head from 'next/head'
import twemoji from 'twemoji'

import Layout from 'components/layout'
import Container from 'components/container'
import Stories from 'components/stories'
import { getAllPosts, getTopics, getTopicLabelFromId, necessaryFieldsForPostList } from 'lib/api'
import { markdownToHtml } from 'lib/markdownToHtml'
import { SITE_NAME } from 'lib/constants'
import type { ContentfulPostFields } from 'types/api'

export const config = { amp: true }

type Props = {
  posts: ContentfulPostFields[]
  tagName: string
  titles: string[]
  summaries: string[]
}

const TagPosts = ({ posts, tagName, titles, summaries }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>{tagName} | {SITE_NAME}</title>
        </Head>
        <Container>
          <h1 className={`
            max-w-2xl mx-auto mb-12
            text-2xl sm:text-4xl text-left font-bold tracking-wide break-all
          `}>
            {tagName}
          </h1>
          {posts.length > 0 && (
            <Stories
              posts={posts}
              titles={titles}
              summaries={summaries}
            />
          )}
        </Container>
      </Layout>
    </>
  )
}

export default TagPosts

type Params = {
  params: {
    tag: string
  }
}

export async function getStaticProps({ params }: Params) {
  const allPosts = await getAllPosts(necessaryFieldsForPostList)
  const posts = allPosts.filter(post => post.topics.some(topic => topic.fields.id === params.tag))
  const topic = await getTopicLabelFromId(params.tag)
  const titles = await Promise.all(posts.map(async (post) =>
    await markdownToHtml(post.title)
  ))
  const summaries = await Promise.all(posts.map(async (post) =>
    await markdownToHtml(
      twemoji.parse(
        (post.summary ?? post.content.replace(/([\s\S]+)\n<!--more-->[\s\S]+/, '$1')) + '…'
      )
      .replace(/className=/g, 'class=')
      .replace(/<img/g, '<amp-img width="1.5rem" height="1.5rem"'),
      { removeP: false },
    )
  ))

  return {
    props: {
      posts,
      tagName: topic,
      titles,
      summaries,
    },
  }
}

export async function getStaticPaths() {
  const topics = await getTopics()
  return {
    paths: topics.map(topic => ({
      params: {
        tag: topic.id
      },
    })),
    fallback: false,
  }
}
