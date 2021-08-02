import { MDXRemote } from 'next-mdx-remote'
import Link from 'next/link'
import { Tweet } from 'react-twitter-widgets'

import Heading from '../mdx/heading'
import PostImage from '../mdx/post-image'
import Video, { VideoProps } from '../mdx/video'
import CodeBlock, { CodeBlockProps } from '../mdx/code-block'
import Tooltip, { TooltipProps } from '../mdx/tltp'
import Manga, { MangaProps } from '../mdx/manga'
import MangaText, { MangaTextProps } from '../mdx/manga-text'
import Sandbox from '../mdx/sandbox'
import markdownStyles from './markdown-styles.module.css'

type Props = {
  source: {
    compiledSource: string,
    scope: {}
  }
  slug: string
}

type PostImageProps = {
  src: string
  alt: string
  ext?: 'png' | 'gif' | 'jpg'
}

type PostLinkProps = {
  label: string
  to: string
}

const PostBody = ({ source, slug }: Props) => {
  const components = {
    a: ({ href, children }: { href: string, children: string }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    ),
    h2: ({ children }: { children: any }) => <Heading type={2} content={children} />,
    h3: ({ children }: { children: any }) => <Heading type={3} content={children} />,
    postimage: (props: PostImageProps) => <PostImage slug={slug} {...props} />,
    video: (props: Omit<VideoProps, 'slug'>) => <Video slug={slug} {...props} />,
    code: (props: CodeBlockProps) => <CodeBlock {...props} />,
    icode: (props: any) => <code>{props.children}</code>,
    pstlk: (props: PostLinkProps) => (
      <Link href={props.to}>
        <a className="underline transition-colors duration-300 hover:text-pink-400">
          {props.label}
        </a>
      </Link>
    ),
    tltp: (props: TooltipProps) => <Tooltip {...props} />,
    manga: (props: Omit<MangaProps, 'slug'>) => <Manga slug={slug} {...props} />,
    'manga-text': (props: MangaTextProps) => <MangaText {...props} />,
    tweet: ({ id }: { id: string }) => <Tweet tweetId={id} />,
    sandbox: (props: { name: string, link: string }) => <Sandbox {...props} />,
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
