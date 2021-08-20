import { useState, useEffect, useRef, ReactElement } from 'react'
import { useParsedMarkdown } from 'components/useParsedMarkdown'

import styles from './tooltip.module.css'

export type TooltipProps = {
  label: string
  children: string | ReactElement
}

const Tooltip = ({ label, children }: TooltipProps) => {
  const content = useParsedMarkdown(children)
  const parsedLabel = useParsedMarkdown(label)

  const [visible, setVisible] = useState(false)
  const [timeoutID, setTimeoutID] = useState<number>()

  const [tooltipOverflow, setTooltipOverflow] = useState(false)
  const tooltipRef = useRef<HTMLSpanElement>(null)

  const handleMouseOver = () => {
    clearTimeout(timeoutID)
    if (!visible) {
      setVisible(true)
    }
  }
  const handleMouseOut = () => {
    clearTimeout(timeoutID)
    if (visible) {
      setTimeoutID(window.setTimeout(() => setVisible(false), 300))
    }
  }

  const alignTooltip = () => {
    if (tooltipRef.current
      && tooltipRef.current.getBoundingClientRect().right + 16 > document.documentElement.clientWidth
    ) {
      setTooltipOverflow(true)
    }
  }

  useEffect(() => { alignTooltip() }, [])

  return (
    <span
      className={`${styles['tooltip-container']} relative text-pink-400`}
      onMouseOver={handleMouseOver}
      onMouseOut={visible ? () => {} : handleMouseOut}
      onTouchStart={() => {}}
    >
      <span
        ref={tooltipRef}
        className={`
          ${styles[tooltipOverflow ? 'tooltip-overflow' : 'tooltip']}
          absolute top-full${tooltipOverflow ? ' right-0' : ''} mt-4 p-2
          opacity-0 bg-pink-100 rounded text-sm
          transition duration-300
          ${visible ? '' : '-'}z-10
        `}
        dangerouslySetInnerHTML={{ __html: content }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />
      <span dangerouslySetInnerHTML={{ __html: parsedLabel }} />
    </span>
  )
}

export default Tooltip
