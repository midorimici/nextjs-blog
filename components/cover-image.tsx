import { useAmp } from 'next/amp'
import Image from 'next/image'

type Props = {
  title: string
  src: string
}

const CoverImage = ({ title, src }: Props) => {
  const isAmp = useAmp()

  return (isAmp ? (
    <amp-img
      src={src}
      width={640}
      height={360}
      alt={`Cover Image for ${title}`}
      layout="intrinsic"
      className="rounded-t-2xl"
    />
  ) : (
    <Image
      src={src}
      width={640}
      height={360}
      alt={`Cover Image for ${title}`}
      className="rounded-t-2xl"
    />
  )
  )
}

export default CoverImage
