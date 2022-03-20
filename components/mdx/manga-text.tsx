import ReactDOM from 'react-dom'
import { useParsedMarkdown } from 'components/useParsedMarkdown'
import { useEffect, useRef } from 'react'
import Tooltip from './tltp'

export type MangaTextProps = {
  x: number
  y: number
  text: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
  color?: string
}

const MangaText = ({ x, y, text, size = 'xl', color }: MangaTextProps) => {
  const content = useParsedMarkdown(text, { minimum: false })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tooltips = ref.current?.getElementsByTagName('tltp')
    if (tooltips) {
      for (let tooltip of tooltips) {
        const label = tooltip.getAttribute('label') ?? ''
        const content = tooltip.innerHTML
        const span = document.createElement('span')
        ReactDOM.render(<Tooltip label={label}>{content}</Tooltip>, span, () => {
          tooltip.replaceWith(span)
        })
      }
    }
  }, [ref, content])

  return (
    <div
      className={`
        absolute text-center text-xs md:text-${size}
      `}
      style={{ left: `${x}%`, top: `${y}%`, color: color ?? 'inherit' }}
      dangerouslySetInnerHTML={{ __html: content }}
      ref={ref}
    />
  )
}

export default MangaText
