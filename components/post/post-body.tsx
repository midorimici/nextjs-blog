import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXRemote } from 'next-mdx-remote'
import { Tweet } from 'react-twitter-widgets'

import Heading from 'components/mdx/heading'
import MobileTOC from './mobileTOC'
import PostImage, { PostImageProps } from 'components/mdx/post-image'
import Video, { VideoProps } from 'components/mdx/video'
import CodeBlock, { CodeBlockProps } from 'components/mdx/code-block'
import PostLink, { PostLinkProps } from 'components/mdx/pstlk'
import RelatedPost, { RelatedPostProps } from 'components/mdx/relpos'
import Tooltip, { TooltipProps } from 'components/mdx/tltp'
import Fukidashi, { FukidashiProps } from 'components/mdx/fukidashi'
import Manga, { MangaProps } from 'components/mdx/manga'
import MangaText, { MangaTextProps } from 'components/mdx/manga-text'
import Sandbox from 'components/mdx/sandbox'
import YouTube from 'components/mdx/youtube'
import Affiliate, { AffiliateProps } from 'components/mdx/affiliate'
import markdownStyles from './markdown-styles.module.css'

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
    toc: tocSource ? () => <MobileTOC source={tocSource} /> : () => {},
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
