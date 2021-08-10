import { useParsedMarkdown } from '../useParsedMarkdown'

type Props = {
  title: string
}

const PostTitle = ({ title }: Props) => {
  const parsedTitle = useParsedMarkdown(title)
  
  return (
    <h1
      className={`
        text-2xl sm:text-4xl
        mb-12
        text-left
        font-bold
        tracking-wide
        leading-relaxed
        break-words
      `}
      dangerouslySetInnerHTML={{ __html: parsedTitle }}
    />
  )
}

export default PostTitle
