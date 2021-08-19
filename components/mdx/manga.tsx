import Image from 'next/image'

export type MangaProps = {
  assets: Record<string, {
    url: string
    size: {
        width: number
        height: number
    } | undefined
  }>
  src: string
  alt: string
  children: Element
}

const Manga = ({ assets, src, alt, children }: MangaProps) => {
  const imgPath = assets[src].url
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
