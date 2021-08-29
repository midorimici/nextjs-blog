type Props = {
  title: string
}

const PostTitle = ({ title }: Props) => {
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
      dangerouslySetInnerHTML={{ __html: title }}
    />
  )
}

export default PostTitle
