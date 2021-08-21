import dynamic from 'next/dynamic'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import { Tweet } from 'react-twitter-widgets'
import { Prism } from 'prism-react-renderer'

import Heading from 'components/mdx/heading'
import type { PostImageProps } from 'components/mdx/post-image'
import type { VideoProps } from 'components/mdx/video'
import type { CodeBlockProps } from 'components/mdx/code-block'
import type { PostLinkProps } from 'components/mdx/pstlk'
import type { RelatedPostProps } from 'components/mdx/relpos'
import type { TooltipProps } from 'components/mdx/tltp'
import type { FukidashiProps } from 'components/mdx/fukidashi'
import type { MangaProps } from 'components/mdx/manga'
import type { MangaTextProps } from 'components/mdx/manga-text'
import type { AffiliateProps } from 'components/mdx/affiliate'
import markdownStyles from './markdown-styles.module.css'

declare global {
  namespace NodeJS {
    interface Global {
      Prism: any
    }
  }
}
declare global {
  interface Window {
    Prism: any
  }
}

(typeof global !== 'undefined' ? global : window).Prism = Prism

require('prismjs/components/prism-docker')
require('prismjs/components/prism-powershell')
require('prismjs/components/prism-ruby')
require('prismjs/components/prism-toml')
require('prismjs/components/prism-vim')

const MobileTOC = dynamic(() => import('./mobileTOC'), { ssr: false })
const PostImage = dynamic(() => import('components/mdx/post-image'))
const Video = dynamic(() => import('components/mdx/video'))
const CodeBlock = dynamic(() => import('components/mdx/code-block'))
const PostLink = dynamic(() => import('components/mdx/pstlk'))
const RelatedPost = dynamic(() => import('components/mdx/relpos'))
const Tooltip = dynamic(() => import('components/mdx/tltp'))
const Fukidashi = dynamic(() => import('components/mdx/fukidashi'))
const Manga = dynamic(() => import('components/mdx/manga'))
const MangaText = dynamic(() => import('components/mdx/manga-text'))
const Sandbox = dynamic(() => import('components/mdx/sandbox'))
const YouTube = dynamic(() => import('components/mdx/youtube'))
const Affiliate = dynamic(() => import('components/mdx/affiliate'))

type Props = {
  source: MDXRemoteSerializeResult<Record<string, unknown>>
  tocSource?: MDXRemoteSerializeResult<Record<string, unknown>>
  assets?: Record<string, {
    url: string
    size: {
        width: number
        height: number
    } | undefined
  }>
  relatedPosts?: Record<string, { title: string, coverImageUrl: string }>
}

const PostBody = ({ source, tocSource, assets, relatedPosts }: Props) => {
  /* eslint-disable react/display-name */
  const components = {
    a: ({ href, children }: { href: string, children: string }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    inlink: ({ to, children }: { to: string, children: string }) => <a href={to}>{children}</a>,
    h2: ({ children }: { children: any }) => <Heading type={2} content={children} />,
    h3: ({ children }: { children: any }) => <Heading type={3} content={children} />,
    toc: () => tocSource && <MobileTOC source={tocSource} />,
    postimage: (props: Omit<PostImageProps, 'assets'>) => assets && <PostImage assets={assets} {...props} />,
    video: (props: Omit<VideoProps, 'assets'>) => assets && <Video assets={assets} {...props} />,
    code: (props: CodeBlockProps) => <CodeBlock {...props} />,
    icode: (props: any) => <code>{props.children}</code>,
    pstlk: (props: PostLinkProps) => <PostLink {...props} />,
    relpos: (props: Omit<RelatedPostProps, 'relatedPosts'>) => (
      relatedPosts && <RelatedPost relatedPosts={relatedPosts} {...props} />
    ),
    tltp: (props: TooltipProps) => <Tooltip {...props} />,
    fukidashi: (props: FukidashiProps) => <Fukidashi {...props} />,
    manga: (props: Omit<MangaProps, 'assets'>) => assets && <Manga assets={assets} {...props} />,
    'manga-text': (props: MangaTextProps) => <MangaText {...props} />,
    tweet: ({ id }: { id: string }) => <Tweet tweetId={id} />,
    sandbox: (props: { name: string, link: string }) => <Sandbox {...props} />,
    yout: ({ id }: { id: string }) => <YouTube id={id} />,
    affiliate: (props: AffiliateProps) => <Affiliate {...props} />,
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className={markdownStyles['markdown']}>
        <MDXRemote {...source} components={components} />
      </div>
    </div>
  )
}

export default PostBody
