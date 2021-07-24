import { MDXRemote } from 'next-mdx-remote'
import Link from 'next/link'
import { Tweet } from 'react-twitter-widgets'

import PostImage from '../mdx/post-image'
import CodeBlock, { CodeBlockProps } from '../mdx/code-block'
import Sandbox from '../mdx/sandbox'
import Video, { VideoProps } from '../mdx/video'
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
    postimage: (props: PostImageProps) => <PostImage slug={slug} {...props} />,
    code: (props: CodeBlockProps) => <CodeBlock {...props} />,
    pstlk: (props: PostLinkProps) => (
      <Link href={props.to}>
        <a className="underline transition-colors duration-300 hover:text-pink-400">
          {props.label}
        </a>
      </Link>
    ),
    tweet: ({ id }: { id: string }) => <Tweet tweetId={id} />,
    sandbox: (props: { name: string, link: string }) => <Sandbox {...props} />,
    video: (props: Omit<VideoProps, 'slug'>) => <Video slug={slug} {...props} />,
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
