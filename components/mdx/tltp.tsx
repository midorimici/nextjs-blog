import { ReactElement } from 'react'
import { useParsedMarkdown } from '../useParsedMarkdown'

export type TooltipProps = {
  label: string
  children: string | ReactElement
}

const Tooltip = ({ label, children }: TooltipProps) => {
  const content = useParsedMarkdown(children)
  const parsedLabel = useParsedMarkdown(label)

  return (
    <span className="tooltip-container relative text-pink-400" onTouchStart={() => {}}>
      <span className="tooltip" dangerouslySetInnerHTML={{ __html: content }} />
      <span dangerouslySetInnerHTML={{ __html: parsedLabel }} />
    </span>
  )
}

export default Tooltip
