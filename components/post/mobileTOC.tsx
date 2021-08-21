import { useState } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import Link from 'next/link'

const MobileTOC = ({ source }: { source: MDXRemoteSerializeResult<Record<string, unknown>> }) => {
  const [visible, setVisible] = useState(false)

  if (!window.matchMedia('(min-width: 1024px)').matches && !visible) setVisible(true)

  if (!visible) return null

  /* eslint-disable react/display-name */
  const components = {
    a: ({ href, children }: { href: string, children: string }) => (
      <Link href={href}><a>{children}</a></Link>
    ),
  }

  return (
    <details className="block lg:hidden">
      <summary>目次</summary>
      <div>
        <MDXRemote {...source} components={components} />
      </div>
    </details>
  )
}

export default MobileTOC
