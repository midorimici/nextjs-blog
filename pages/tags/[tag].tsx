import Head from 'next/head'

import Layout from 'components/layout'
import Container from 'components/container'
import Stories from 'components/stories'
import { getPostsByTopic, getTopicLabelFromId, getTopics } from 'lib/api'
import { SITE_NAME } from 'lib/constants'
import type { ContentfulPostFields } from 'types/api'

type Props = {
  posts: ContentfulPostFields[]
  tagName: string
}

const TagPosts = ({ posts, tagName }: Props) => {
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
          {posts.length > 0 && <Stories posts={posts} />}
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
  const posts = await getPostsByTopic(params.tag)
  const topic = await getTopicLabelFromId(params.tag)

  return {
    props: { posts, tagName: topic },
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
