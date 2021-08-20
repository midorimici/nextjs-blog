import Link from 'next/link'

import { useParsedMarkdown } from 'components/useParsedMarkdown'

export type PostLinkProps = {
  label: string
  to: string
}

const PostLink = ({ label, to }: PostLinkProps) => {
  const inPage = to[0] === '#'
  const parsedLabel = useParsedMarkdown(label)
  
  return (
    inPage ? (
      <a
        href={to}
        className="underline transition-colors duration-300 hover:text-pink-400"
        dangerouslySetInnerHTML={{ __html: parsedLabel }}
      />
    ) : (
      <Link href={`/posts/${to}`}>
        <a
          className="underline transition-colors duration-300 hover:text-pink-400"
          dangerouslySetInnerHTML={{ __html: parsedLabel }}
        />
      </Link>
    )
  )
}

export default PostLink
