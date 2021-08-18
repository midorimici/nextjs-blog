import Head from 'next/head'

import Layout from 'components/layout'
import Container from 'components/container'
import Stories from 'components/stories'
import { getPostsByTopic } from 'lib/api'
import { SITE_NAME } from 'lib/constants'
import { brandTopicsMap, topicNames } from 'lib/topics'
import type { ContentfulPostFields } from 'types/api'

type Props = {
  posts: ContentfulPostFields[]
  tag: string
}

const TagPosts = ({ posts, tag }: Props) => {
  const tagName = brandTopicsMap[tag]?.label ?? tag
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

  return {
    props: { posts, tag: params.tag },
  }
}

export async function getStaticPaths() {
  return {
    paths: topicNames.map((tag: string) => {
      return {
        params: {
          tag,
        },
      }
    }),
    fallback: false,
  }
}
