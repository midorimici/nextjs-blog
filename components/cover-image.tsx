import cn from 'classnames'
import Image from 'next/image'

type Props = {
  title: string
  src: string
  slug: string
}

const CoverImage = ({ title, src, slug }: Props) => {
  return (
    <Image
      src={src}
      width={640}
      height={360}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
    />
  )
}

export default CoverImage
