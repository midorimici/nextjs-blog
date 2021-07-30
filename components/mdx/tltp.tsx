import { useParsedMarkdown } from '../useParsedMarkdown'

export type TooltipProps = {
  label: string
  children: string
}

const Tooltip = ({ label, children }: TooltipProps) => {
  const getInnerString = () => {
    const res = []
    for (const e of children) {
      if (typeof e === 'string') res.push(e)
    }
    return res.join('<br>')
  }

  const content = useParsedMarkdown(getInnerString())
  const parsedLabel = useParsedMarkdown(label)

  return (
    <span className="tooltip-container relative text-pink-400" onTouchStart={() => {}}>
      <span className="tooltip" dangerouslySetInnerHTML={{ __html: content }} />
      <span dangerouslySetInnerHTML={{ __html: parsedLabel }} />
    </span>
  )
}

export default Tooltip
