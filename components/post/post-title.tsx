import { useParsedMarkdown } from '../useParsedMarkdown'

type Props = {
  title: string
}

const PostTitle = ({ title }: Props) => {
  const parsedTitle = useParsedMarkdown(title)
  
  return (
    <h1
      className={`
        text-4xl
        mb-12
        text-left
        font-bold
        tracking-wide
        leading-relaxed
      `}
      dangerouslySetInnerHTML={{ __html: parsedTitle }}
    />
  )
}

export default PostTitle
