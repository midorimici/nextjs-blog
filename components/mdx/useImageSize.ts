import { useState } from 'react'

export const useImageSize = (src: string) => {
  const [width, setWidth] = useState(360)
  const [height, setHeight] = useState(360)

  if (process.browser) {
    const img = new Image()
    img.onload = () => {
      const naturalWidth = img.naturalWidth
      const naturalHeight = img.naturalHeight
      setWidth(naturalWidth)
      setHeight(naturalHeight)
    }
    img.src = src
  }

  return { width, height }
}
