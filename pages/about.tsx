import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Head from 'next/head'
import Image from 'next/image'

import Layout from 'components/layout'
import AboutPost from 'components/post/about'
import { getAboutPost } from 'lib/api'
import { SITE_NAME } from 'lib/constants'

type Props = {
  postTitle: string
  profileUrl: string
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}

const About = ({ postTitle, profileUrl, source }: Props) => {
  return (
    <>
      <Head>
        <title>
          {postTitle} | {SITE_NAME}
        </title>
      </Head>
      <Layout>
        <article className="mb-8">
          <div className="max-w-2xl mx-auto">
            <h1
              className={`
                mb-12 text-2xl sm:text-4xl text-left font-bold tracking-wide break-all
              `}
            >{postTitle}</h1>
            <div className="flex justify-center">
              <Image
                src={profileUrl}
                alt="プロフィール画像"
                width={160}
                height={160}
                priority
              />
            </div>
            <AboutPost source={source} />
          </div>
        </article>
      </Layout>
    </>
  )
}

export default About

export async function getStaticProps() {
  const post = await getAboutPost()
  const content = await serialize(post.content || '')

  return {
    props: {
      postTitle: post.title,
      profileUrl: post.profileUrl,
      source: content,
    },
  }
}
