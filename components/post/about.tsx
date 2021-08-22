type Props = {
  content: string
}

const AboutPost = ({ content }: Props) => {
  return (
    <div
      className={`markdown max-w-2xl mx-auto`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default AboutPost
