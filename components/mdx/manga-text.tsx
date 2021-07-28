import { useParsedMarkdown } from '../useParsedMarkdown'

export type MangaTextProps = {
  x: number
  y: number
  text: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  color?: string
}

const MangaText = ({ x, y, text, size = 'xl', color }: MangaTextProps) => {
  const content = useParsedMarkdown(text)
  
  return (
    <div
      className={`
        absolute text-center text-xs md:text-${size}
        ${color ? `text-${color}` : ''}
      `}
      style={{ left: `${x}%`, top: `${y}%` }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default MangaText
