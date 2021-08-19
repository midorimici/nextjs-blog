import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import { useImagePlaceholder } from 'components/useImagePlaceholder'

export type PostImageProps = {
  assets: Record<string, {
    url: string
    size: {
        width: number
        height: number
    } | undefined
  }>
  src: string
  alt: string
}

const PostImage = ({ assets, src, alt }: PostImageProps) => {
  const asset = assets[src]
  const path = asset.url
  const size = asset.size ?? { width: 640, height: 360 }
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
