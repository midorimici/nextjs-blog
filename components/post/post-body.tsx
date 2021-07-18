import { MDXRemote } from 'next-mdx-remote'
import PostImage from './post-image'
import CodeBlock from './code-block'
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

type codeBlockProps = {
  children: string
  className: string
}

const PostBody = ({ source, slug }: Props) => {
  const components = {
    postimage: (props: PostImageProps) => <PostImage slug={slug} {...props} />,
    code: (props: codeBlockProps) => <CodeBlock {...props} />
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
