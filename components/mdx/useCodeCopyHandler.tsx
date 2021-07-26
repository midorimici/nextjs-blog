import { useState } from 'react'

export const useCodeCopyHandler = (codes: string) => {
  const [successed, setSuccessed] = useState(false);

  const handleCopyClick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codes)
    }
    setSuccessed(true)
    setInterval(() => setSuccessed(false), 5000)
  }

  return { successed, handleCopyClick }
}
