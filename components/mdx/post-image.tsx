import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { useImageSize } from './useImageSize'
import { useImagePlaceholder } from 'components/useImagePlaceholder'

export type PostImageProps = {
  slug: string
  src: string
  alt: string
  ext?: 'png' | 'gif' | 'jpg'
}

const PostImage = ({ slug, src, alt, ext = 'jpg' }: PostImageProps) => {
  const path = `/posts/${slug}/${src}.${ext}`
  const size = useImageSize(path)
  const placeholder = useImagePlaceholder(size.width, size.height)
  
  return (
    <Zoom>
      <Image
        src={path}
        alt={alt}
        title={alt}
        width={size.width}
        height={size.height}
        placeholder='blur'
        blurDataURL={`data:image/svg+xml;base64,${placeholder}`}
      />
    </Zoom>
  )
}

export default PostImage
