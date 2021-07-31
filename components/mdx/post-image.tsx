import Image from 'next/image'

import { useImageSize } from './useImageSize'

type Props = {
  slug: string
  src: string
  alt: string
  ext?: 'png' | 'gif' | 'jpg'
}

const PostImage = ({ slug, src, alt, ext = 'jpg' }: Props) => {
  const path = `/posts/${slug}/${src}.${ext}`
  const size = useImageSize(path)
  
  return (
    <Image
      src={path}
      alt={alt}
      title={alt}
      width={size.width}
      height={size.height}
    />
  )
}

export default PostImage
