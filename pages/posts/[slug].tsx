import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'

import Layout from 'components/layout'
import { getAllPosts, getPostBySlug, getRelatedPosts, necessaryFieldsForPost } from 'lib/api'

import { SITE_NAME } from 'lib/constants'
import type { PostFieldsToShow } from 'types/api'

/* eslint-disable react/display-name */
const PostHeader = dynamic(() => import('components/post/post-header'))
const PostBody = dynamic(() => import(
  'components/post/post-body'),
  { 
    loading: () => (
      <FontAwesomeIcon
        icon={faSun}
        width={20}
        className="text-center text-yellow-500 animate-spin"
      />
    )
  },
)
const SideTOC = dynamic(() => import('components/post/sideTOC'), { ssr: false })
const BackToTopButton = dynamic(() => import('components/post/backToTopButton'), { ssr: false })

type Props = {
  post: PostFieldsToShow
  relatedPosts: Record<string, { title: string, coverImageUrl: string }>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
}

const Post = ({ post, relatedPosts, source }: Props) => {
  return (
    <>
      <Head>
        <title>
          {post.title.replace(/<br\/>/g, '')} | {SITE_NAME}
        </title>
        <meta property="og:image" content={post.assets['_index'].url} />
        {post.katex && (
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css"
            integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn"
            crossOrigin="anonymous"
          />
        )}
      </Head>
      <Layout>
        <div className="block lg:flex">
          <article className="flex-grow mb-8">
            <PostHeader
              title={post.title}
              date={post.date}
              lastmod={post.lastmod}
              topics={post.topics}
            />
            <PostBody
              source={source}
              toc={post.toc}
              assets={post.assets}
              relatedPosts={relatedPosts}
            />
          </article>
          <SideTOC toc={post.toc} />
        </div>
        <BackToTopButton />
      </Layout>
    </>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = await getPostBySlug(params.slug)
  const postContent = post?.content ?? ''

  const relatedPosts = await getRelatedPosts(postContent)

  const content = await serialize(postContent, {
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
      relatedPosts,
      source: content,
    },
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts(necessaryFieldsForPost)
  const slugs = posts.map(post => post.slug)

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
