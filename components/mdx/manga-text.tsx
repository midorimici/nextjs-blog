import { useParsedMarkdown } from '../useParsedMarkdown'

export type MangaTextProps = {
  x: number
  y: number
  text: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  color?: string
}

const MangaText = ({ x, y, text, size = 'xl', color }: MangaTextProps) => {
  const content = useParsedMarkdown(text, false)
  
  return (
    <div
      className={`
        absolute text-center text-xs md:text-${size}
      `}
      style={{ left: `${x}%`, top: `${y}%`, color: color ?? 'inherit' }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default MangaText
