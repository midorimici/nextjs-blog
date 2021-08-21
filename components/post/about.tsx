// import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
// import { MDXRemote } from 'next-mdx-remote'

// import Heading from 'components/mdx/heading'
import markdownStyles from './markdown-styles.module.css'

type Props = {
  content: string // MDXRemoteSerializeResult<Record<string, unknown>>
}

const AboutPost = ({ content }: Props) => {
  /* eslint-disable react/display-name */
  // const components = {
  //   a: ({ href, children }: { href: string, children: string }) => (
  //     <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  //   ),
  //   h2: ({ children }: { children: any }) => <Heading type={2} content={children} />,
  //   h3: ({ children }: { children: any }) => <Heading type={3} content={children} />,
  // }

  return (
    <div
      className={`${markdownStyles.markdown} max-w-2xl mx-auto`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default AboutPost
