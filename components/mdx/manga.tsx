import Image from 'next/image'

export type MangaProps = {
  slug: string
  src: string
  alt: string
  children: Element
}

const Manga = ({ slug, src, alt, children }: MangaProps) => {
  const imgPath = `/posts/${slug}/${src}.png`
  return (
    <div className="relative my-4">
      <Image
        src={imgPath}
        alt={alt}
        width={42*16}
        height={28*16}
      />
      {children}
    </div>
  )
}

export default Manga
