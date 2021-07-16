import Image from 'next/image'

type Props = {
  title: string
  src: string
}

const CoverImage = ({ title, src }: Props) => {
  return (
    <Image
      src={src}
      width={640}
      height={360}
      alt={`Cover Image for ${title}`}
      className="rounded-t-2xl"
    />
  )
}

export default CoverImage
