import { useState } from 'react'

const MobileTOC = ({ toc }: { toc: string }) => {
  const [visible, setVisible] = useState(false)

  if (!window.matchMedia('(min-width: 1024px)').matches && !visible) setVisible(true)

  if (!visible) return null

  return (
    <details className="block lg:hidden">
      <summary>目次</summary>
      <div dangerouslySetInnerHTML={{ __html: toc }} />
    </details>
  )
}

export default MobileTOC
