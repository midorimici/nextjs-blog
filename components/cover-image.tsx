type Props = {
  title: string
  src: string
}

const CoverImage = ({ title, src }: Props) => {
  return (
    <amp-img
      src={src}
      width={640}
      height={360}
      alt={`Cover Image for ${title}`}
      layout="intrinsic"
      className="rounded-t-2xl"
    />
  )
}

export default CoverImage
