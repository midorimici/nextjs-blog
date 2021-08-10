import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

import tocStyles from './toc-styles.module.css'

const TOC = ({ source }: { source: MDXRemoteSerializeResult<Record<string, unknown>> }) => {
  return (
    <>
      <div
        className="text-xl sm:text-2xl mb-4 leading-relaxed border-b-2 border-yellow-500"
      >
        目次
      </div>
      <div className={tocStyles['toc']}>
        <MDXRemote {...source} />
      </div>
    </>
  )
}

export default TOC
