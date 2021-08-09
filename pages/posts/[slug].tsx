import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import PostBody from '../../components/post/post-body'
import PostHeader from '../../components/post/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getPostSlugs } from '../../lib/api'
import PostTitle from '../../components/post/post-title'

import { SITE_NAME } from '../../lib/constants'
import PostType from '../../types/post'

type Props = {
  post: PostType
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}

const Post = ({ post, source }: Props) => {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const imagePath = `/posts/${post.slug}/index.jpg`

  return (
    <Layout>
      {router.isFallback ? (
        <PostTitle title='Loading…' />
      ) : (
        <>
          <article className="mb-8">
            <Head>
              <title>
                {post.title.replace(/<br\/>/g, '')} | {SITE_NAME}
              </title>
              <meta property="og:image" content={imagePath} />
              {post.katex && (
                <link
                  rel="stylesheet"
                  href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css"
                  integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn"
                  crossOrigin="anonymous"
                />
              )}
            </Head>
            <PostHeader
              title={post.title}
              date={post.date}
              lastmod={post.lastmod}
              topics={post.topics}
            />
            <PostBody source={source} slug={post.slug} />
          </article>
        </>
      )}
    </Layout>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'summary',
    'lastmod',
    'topics',
    'katex',
    'content',
    'published',
  ])
  const content = await serialize(post.content || '', {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }
  })

  return {
    props: {
      post: {
        ...post,
      },
      source: content,
    },
  }
}

export async function getStaticPaths() {
  const slugs = getPostSlugs()

  return {
    paths: slugs.map((slug) => {
      return {
        params: {
          slug,
        },
      }
    }),
    fallback: false,
  }
}
