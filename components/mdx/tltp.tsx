export type TooltipProps = {
  label: string
  children: Element
}

const Tooltip = ({ label, children }: TooltipProps) => {
  return (
    <span className="tooltip-container relative text-pink-400" onTouchStart={() => {}}>
      <span className="tooltip">{children}</span>
      {label}
    </span>
  )
}

export default Tooltip
