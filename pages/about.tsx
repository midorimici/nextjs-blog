import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Head from 'next/head'

import Layout from 'components/layout'
import PostBody from 'components/post/post-body'
import { getAboutPost } from 'lib/api'
import { SITE_NAME } from 'lib/constants'

type Props = {
  postTitle: string
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}

const About = ({ postTitle, source }: Props) => {
  return (
    <Layout>
      <article className="mb-8">
        <Head>
          <title>
            {postTitle} | {SITE_NAME}
          </title>
        </Head>
        <h1
          className={`
            max-w-2xl mx-auto mb-12
            text-2xl sm:text-4xl text-left font-bold tracking-wide break-all
          `}
        >{postTitle}</h1>
        <PostBody source={source} slug='about' />
      </article>
    </Layout>
  )
}

export default About

export async function getStaticProps() {
  const post = getAboutPost()
  const content = await serialize(post.content || '')

  return {
    props: {
      postTitle: post.title,
      source: content,
    },
  }
}
