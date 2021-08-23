import { useState } from 'react'

const SideTOC = ({ toc }: { toc: string }) => {
  const [visible, setVisible] = useState(false)

  if (window.matchMedia('(min-width: 1024px)').matches && !visible) setVisible(true)

  if (!visible) return null
  
  return (
    <aside className="w-96 hidden lg:block">
      <div className="sticky top-16">
        <div
          className="text-xl sm:text-2xl mb-4 leading-relaxed border-b-2 border-yellow-500"
        >
          目次
        </div>
        <div
          className='toc'
          dangerouslySetInnerHTML={{ __html: toc }}
        />
      </div>
    </aside>
  )
}

export default SideTOC
