import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import markdownTOC from 'markdown-toc'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import twemoji from 'twemoji'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'

import Layout from 'components/layout'
import { getAllPosts, necessaryFieldsForPost } from 'lib/api'

import { SITE_NAME, HOME_OG_IMAGE_URL } from 'lib/constants'
import type { ContentfulPostFields } from 'types/api'

/* eslint-disable react/display-name */
const PostHeader = dynamic(() => import('components/post/post-header'))
const PostBody = dynamic(() => import(
  'components/post/post-body'),
  { loading: () => <FontAwesomeIcon icon={faSun} width={20} className="max-w-2xl mx-auto animate-spin" /> },
)
const SideTOC = dynamic(() => import('components/post/sideTOC'), { ssr: false })
const BackToTopButton = dynamic(() => import('components/post/backToTopButton'), { ssr: false })

type Props = {
  post: ContentfulPostFields
  relatedPosts: Record<string, { title: string, coverImageUrl: string }>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
  tocSource: MDXRemoteSerializeResult<Record<string, unknown>>
}

const Post = ({ post, relatedPosts, source, tocSource }: Props) => {
  const assets = post.assets ? Object.fromEntries(
    post.assets.map(asset => [
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

  return (
    <>
      <Head>
        <title>
          {post.title.replace(/<br\/>/g, '')} | {SITE_NAME}
        </title>
        <meta property="og:image" content={assets['_index'].url} />
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
              topics={post.topics.map(topic => topic.fields)}
            />
            <PostBody
              source={source}
              tocSource={tocSource}
              assets={assets}
              relatedPosts={relatedPosts}
            />
          </article>
          <SideTOC source={tocSource} />
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
  const posts = await getAllPosts(necessaryFieldsForPost)
  const post = posts.find(post => post.slug === params.slug)
  const postContent = twemoji.parse(post?.content ?? '').replace(/class="emoji"/g, 'className="emoji"')

  let relatedPosts: Record<string, { title: string, coverImageUrl: string }> = {}
  const relatedPostSlugsMatches = postContent.matchAll(/<relpos link="(.+?)" \/>/g)
  for (const match of relatedPostSlugsMatches) {
    const slug = match[1]
    const titleAndAssets = posts.find(post => post.slug === slug)
    if (titleAndAssets) {
      relatedPosts[slug] = {
        title: titleAndAssets.title,
        coverImageUrl: 'https:' + titleAndAssets.assets?.find(
          asset => asset.fields.file.fileName === '_index.jpg'
        )?.fields.file.url ?? HOME_OG_IMAGE_URL.slice(6)
      }
    }
  }

  const postWithTOC = (postContent).replace(/## .+/, '<toc />\n\n$&')
  const content = await serialize(postWithTOC, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }
  })
  const toc = await serialize(markdownTOC(post?.content ?? '').content)

  return {
    props: {
      post: {
        ...post,
      },
      relatedPosts,
      source: content,
      tocSource: toc,
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
