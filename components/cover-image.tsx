import Image from 'next/image'

import { useImagePlaceholder } from './useImagePlaceholder'

type Props = {
  title: string
  src: string
}

const CoverImage = ({ title, src }: Props) => {
  const placeholder = useImagePlaceholder(640, 360)
  
  return (
    <Image
      src={src}
      width={640}
      height={360}
      alt={`Cover Image for ${title}`}
      className="rounded-t-2xl"
      placeholder='blur'
      blurDataURL={`data:image/svg+xml;base64,${placeholder}`}
    />
  )
}

export default CoverImage
