export const useInlineHighlightIndices = (meta?: string) => {
  const regex = /[\d:;,-]+/

  if (!meta || !(regex).test(meta)) return () => false

  const linesAndIndices = new Map<number, number[][]>()
  for (const line of regex.exec(meta)?.[0].split(';') ?? []) {
    const [lineNumber, indices] = line.split(':')
    if (!indices) {
      console.log(meta, '← 行番号か単語番号を書き忘れているよ！行番号:単語番号の形式で書いてね！')
      return () => false
    }
    linesAndIndices.set(+lineNumber,
      indices.split(',').map((range: string) =>
        range.split('-').map((index: string) => +index)
      )
    )
  }

  return (lineIndex: number, tokenIndex: number) => {
    const lineNumber = lineIndex + 1
    return linesAndIndices.get(lineNumber)?.some(([start, end]: number[]) => (
      end ? tokenIndex >= start && tokenIndex <= end : tokenIndex === start
    ))
  }
}
