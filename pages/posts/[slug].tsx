import { serialize } from 'next-mdx-remote/serialize'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import PostBody from '../../components/post-body'
import PostHeader from '../../components/post-header'
import Layout from '../../components/layout'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import PostTitle from '../../components/post-title'
import PostImage from '../../components/post-image'

import { SITE_NAME } from '../../lib/constants'
import PostType from '../../types/post'

type Props = {
  post: PostType
  source: {
    compiledSource: string,
    scope: {}
  }
}

type PostImageProps = {
  src: string
  alt: string
  ext?: 'png' | 'gif' | 'jpg'
  width?: number | 'auto'
}

const Post = ({ post, source }: Props) => {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const imagePath = `/posts/${post.slug}/index.jpg`

  const components = {
    postimage: (props: PostImageProps) => <PostImage slug={post.slug} {...props} />,
  }

  return (
    <Layout>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article className="mb-8">
            <Head>
              <title>
                {post.title} | {SITE_NAME}
              </title>
              <meta property="og:image" content={imagePath} />
            </Head>
            <PostHeader
              title={post.title}
              date={post.date}
              lastmod={post.lastmod}
            />
            <PostBody source={source} components={components} />
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
    'tags',
    'content',
  ])
  const content = await serialize(post.content || '')

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
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      }
    }),
    fallback: false,
  }
}
