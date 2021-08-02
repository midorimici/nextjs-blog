import Link from 'next/link'

import { useParsedMarkdown } from '../useParsedMarkdown'

export type PostLinkProps = {
  label: string
  to: string
}

const PostLink = ({ to, label }: PostLinkProps) => {
  const parsedLabel = useParsedMarkdown(label)
  
  return (
    <Link href={to}>
      <a
        className="underline transition-colors duration-300 hover:text-pink-400"
        dangerouslySetInnerHTML={{ __html: parsedLabel }}
      />
    </Link>
  )
}

export default PostLink
