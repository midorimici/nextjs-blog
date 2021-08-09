import { useState, useEffect, useRef, ReactElement } from 'react'
import { useParsedMarkdown } from '../useParsedMarkdown'

export type TooltipProps = {
  label: string
  children: string | ReactElement
}

const Tooltip = ({ label, children }: TooltipProps) => {
  const content = useParsedMarkdown(children)
  const parsedLabel = useParsedMarkdown(label)

  const [tooltipOverflow, setTooltipOverflow] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null)

  const alignTooltip = () => {
    if (tooltipRef.current
      && tooltipRef.current.getBoundingClientRect().right + 16 > document.documentElement.clientWidth
    ) {
      setTooltipOverflow(true)
    }
  }

  useEffect(() => { alignTooltip() }, [tooltipRef.current])

  return (
    <span
      className="tooltip-container relative text-pink-400"
      onTouchStart={() => {}}
    >
      <span
        ref={tooltipRef}
        className={`
          tooltip${tooltipOverflow ? '-overflow' : ''}
          absolute top-full ${tooltipOverflow ? 'right-0' : ''} mt-4 p-2
          opacity-0 bg-pink-100 rounded text-sm
          transition duration-300
        `}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <span dangerouslySetInnerHTML={{ __html: parsedLabel }} />
    </span>
  )
}

export default Tooltip
