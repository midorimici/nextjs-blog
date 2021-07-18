import Image from 'next/image'

type Props = {
  slug: string
  src: string
  alt: string
  ext?: 'png' | 'gif' | 'jpg'
  width?: number | 'auto'
}

const PostImage = ({slug, src, alt, ext = 'jpg', width}: Props) => {
  return (
    <p className="relative h-96">
      <Image
        src={`/posts/${slug}/${src}.${ext}`}
        alt={alt}
        title={alt}
        layout="fill"
        objectFit="contain"
      />
    </p>
  )
}

export default PostImage
