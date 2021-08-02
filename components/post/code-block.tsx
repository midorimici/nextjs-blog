import Highlight, { defaultProps, Language } from 'prism-react-renderer'

import { useHighlightLineNumbers } from './useHighlightLineNumbers'
import { useInlineHighlightIndices } from './useInlineHighlightIndices'
import { theme } from './codeTheme'

export type CodeBlockProps = {
  children: string
  className: string
  name?: string
  hide_nums?: boolean
  hl_lines?: string
  ins?: string
  del?: string
  inline_hl?: string
}

const CodeBlock = ({
  children,
  className,
  name,
  hide_nums,
  hl_lines,
  ins,
  del,
  inline_hl
}: CodeBlockProps) => {
  const lang = className.replace(/language-/, '') as Language
  const isHighlighted = useHighlightLineNumbers(hl_lines)
  const isInserted = useHighlightLineNumbers(ins)
  const isDeleted = useHighlightLineNumbers(del)
  const isHighlightedInline = useInlineHighlightIndices(inline_hl)

  const highlightColor = (i: number) => {
    if (isHighlighted(i)) return 'yellow'
    else if (isInserted(i)) return 'green'
    else if (isDeleted(i)) return 'red'
  }

  return (
    <div className="relative my-4">
      {name && (
        <span className="px-2 py-1 bg-gray-100 rounded-t border-b font-code text-sm">
          {name}
        </span>
      )}
      <Highlight
        {...defaultProps}
        code={children}
        language={lang}
        theme={theme}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre
            className={`${className} p-4 text-sm overflow-auto`}
            style={style}
          >
            {tokens.map((line, lineIndex) => (!(lineIndex === tokens.length - 1 && line[0].empty) && (
              <div
                key={lineIndex}
                {...getLineProps({line, key: lineIndex})}
                className="table-row"
              >
                {!hide_nums && (
                  <span className={`
                    table-cell px-2 text-right select-none
                    ${highlightColor(lineIndex) ? `bg-${highlightColor(lineIndex)}-100` : ''}
                  `}>
                    {lineIndex+1}
                  </span>
                )}
                <div className={`
                  table-cell
                  pl-2
                  ${highlightColor(lineIndex) ?
                    `bg-gradient-to-r from-${highlightColor(lineIndex)}-50 to-transparent` : ''}
                `}>
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({token, key})}
                      className={isHighlightedInline(lineIndex, key) ?
                        `bg-${highlightColor(lineIndex)}-100
                        border-${highlightColor(lineIndex)}-300 border-b-2` : ''
                      }
                    />
                  ))}
                </div>
                <div className="w-4" />
              </div>
            )))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}

export default CodeBlock
