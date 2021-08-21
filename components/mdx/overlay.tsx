import { useState, useEffect, RefObject } from 'react'

type Props = {
  hide: () => void
  targetRef: RefObject<HTMLDivElement>
}

const Overlay = ({ hide, targetRef }: Props) => {
  if (targetRef.current) {
    window.onscroll = () => {
      const rect = targetRef.current?.getBoundingClientRect()
      if (rect === undefined) return;
      const top = rect.top
      const bottom = rect.bottom
      if (top > document.documentElement.clientHeight - 200 || bottom < 200) {
        hide()
      }
    }
  }

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(95)
  }, [])

  return (
    <div
      className={`
        fixed inset-0 cursor-zoom-out z-20 bg-white opacity-${opacity} transition duration-300
      `}
      onClick={hide}
    />
  )
}

export default Overlay
