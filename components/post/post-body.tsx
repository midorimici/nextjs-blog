import { MDXRemote } from 'next-mdx-remote'
import { Tweet } from 'react-twitter-widgets'

import Heading from '../mdx/heading'
import PostImage, { PostImageProps } from '../mdx/post-image'
import Video, { VideoProps } from '../mdx/video'
import CodeBlock, { CodeBlockProps } from '../mdx/code-block'
import PostLink, { PostLinkProps } from '../mdx/pstlk'
import RelatedPost, { RelatedPostProps } from '../mdx/relpos'
import Tooltip, { TooltipProps } from '../mdx/tltp'
import Fukidashi, { FukidashiProps } from 'components/mdx/fukidashi'
import Manga, { MangaProps } from '../mdx/manga'
import MangaText, { MangaTextProps } from '../mdx/manga-text'
import Sandbox from '../mdx/sandbox'
import YouTube from '../mdx/youtube'
import markdownStyles from './markdown-styles.module.css'

type Props = {
  source: {
    compiledSource: string
    scope: {}
  }
  slug: string
}

const PostBody = ({ source, slug }: Props) => {
  const components = {
    a: ({ href, children }: { href: string, children: string }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    h2: ({ children }: { children: any }) => <Heading type={2} content={children} />,
    h3: ({ children }: { children: any }) => <Heading type={3} content={children} />,
    postimage: (props: Omit<PostImageProps, 'slug'>) => <PostImage slug={slug} {...props} />,
    video: (props: Omit<VideoProps, 'slug'>) => <Video slug={slug} {...props} />,
    code: (props: CodeBlockProps) => <CodeBlock {...props} />,
    icode: (props: any) => <code>{props.children}</code>,
    pstlk: (props: PostLinkProps) => <PostLink {...props} />,
    relpos: (props: RelatedPostProps) => <RelatedPost {...props} />,
    tltp: (props: TooltipProps) => <Tooltip {...props} />,
    fukidashi: (props: FukidashiProps) => <Fukidashi {...props} />,
    manga: (props: Omit<MangaProps, 'slug'>) => <Manga slug={slug} {...props} />,
    'manga-text': (props: MangaTextProps) => <MangaText {...props} />,
    tweet: ({ id }: { id: string }) => <Tweet tweetId={id} />,
    sandbox: (props: { name: string, link: string }) => <Sandbox {...props} />,
    yout: ({ id }: { id: string }) => <YouTube id={id} />,
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles['markdown']}
      >
        <MDXRemote {...source} components={components} />
      </div>
    </div>
  )
}

export default PostBody
