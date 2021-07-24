export const useHighlightLineNumbers = (meta?: string) => {
  const regex = /[\d,-]+/

  if (!meta || !(regex).test(meta)) return () => false

  const lineNumbers = regex.exec(meta)?.[0].split(',')
    .map((v: string) => v.split('-').map((w: string) => +w))
  return (index: number) => {
    const lineNumber = index + 1
    return lineNumbers?.some(([start, end]: number[]) => (
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start
    ))
  }
}
