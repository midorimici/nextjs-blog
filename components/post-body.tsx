import { MDXRemote } from 'next-mdx-remote'
import markdownStyles from './markdown-styles.module.css'

type Props = {
  source: {
    compiledSource: string,
    scope: {}
  }
  components: Record<string, React.ReactNode>
}

const PostBody = ({ source, components }: Props) => {
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
