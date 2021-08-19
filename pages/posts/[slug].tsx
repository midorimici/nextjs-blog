import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import markdownTOC from 'markdown-toc'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import twemoji from 'twemoji'

import PostBody from 'components/post/post-body'
import PostHeader from 'components/post/post-header'
import Layout from 'components/layout'
import { getPostBySlug, getPostSlugs, necessaryFieldsForPost } from 'lib/api'
import PostTitle from 'components/post/post-title'
import TOC from 'components/post/toc'
import BackToTopButton from 'components/post/backToTopButton'

import { SITE_NAME } from 'lib/constants'
import type { ContentfulPostFields } from 'types/api'

type Props = {
  post: ContentfulPostFields
  relatedPosts: Record<string, { title: string, coverImageUrl: string }>
  source: MDXRemoteSerializeResult<Record<string, unknown>>
  tocSource: MDXRemoteSerializeResult<Record<string, unknown>>
}

const Post = ({ post, relatedPosts, source, tocSource }: Props) => {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const assets = Object.fromEntries(
    post.assets.map(asset => [
      asset.fields.file.fileName.split('.')[0], {
        url: `https:${asset.fields.file.url}`,
        size: asset.fields.file.details.image
      }
    ])
  )

  return (
    <Layout>
      {router.isFallback ? (
        <PostTitle title='Loading…' />
      ) : (
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
                tocSource={tocSource}
                slug={post.slug}
                assets={assets}
                relatedPosts={relatedPosts}
              />
            </article>
            <aside className="w-96 hidden lg:block">
              <div className="sticky top-16">
                <TOC source={tocSource} />
              </div>
            </aside>
          </div>
          <BackToTopButton />
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
  const post = await getPostBySlug(params.slug, necessaryFieldsForPost)
  const postContent = twemoji.parse(post.content).replace(/class="emoji"/g, 'className="emoji"')

  let relatedPosts: Record<string, { title: string, coverImageUrl: string }> = {}
  const relatedPostSlugsMatches = postContent.matchAll(/<relpos link="(.+?)" \/>/g)
  for (const match of relatedPostSlugsMatches) {
    const slug = match[1]
    const titleAndAssets = await getPostBySlug(slug, ['title', 'assets'])
    relatedPosts[slug] = {
      title: titleAndAssets.title,
      coverImageUrl: 'https:' + titleAndAssets.assets
        .find(asset => asset.fields.file.fileName === '_index.jpg')?.fields.file.url ?? ''
    }
  }

  const postWithTOC = (postContent).replace(/## .+/, '<toc />\n\n$&')
  const content = await serialize(postWithTOC, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }
  })
  const toc = await serialize(markdownTOC(post.content).content)

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
  const slugs = await getPostSlugs()

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
