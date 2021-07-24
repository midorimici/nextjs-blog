import Highlight, { defaultProps, Language } from 'prism-react-renderer'

import { useHighlightLineNumbers } from './useHighlightLineNumbers'
import { theme } from './codeTheme'

export type CodeBlockProps = {
  children: string
  className: string
  name?: string
  hide_nums?: boolean
  hl_lines?: string
  ins?: string
  del?: string
}

const CodeBlock = ({ children, className, name, hide_nums, hl_lines, ins, del }: CodeBlockProps) => {
  const lang = className.replace(/language-/, '') as Language
  const isHighlighted = useHighlightLineNumbers(hl_lines)
  const isInserted = useHighlightLineNumbers(ins)
  const isDeleted = useHighlightLineNumbers(del)

  const highlightColor = (i: number) => {
    if (isHighlighted(i)) return 'yellow'
    else if (isInserted(i)) return 'green'
    else if (isDeleted(i)) return 'red'
  }

  return (
    <>
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
            style={style}>
            {tokens.map((line, i) => (!(i === tokens.length - 1 && line[0].empty) && (
              <div
                key={i}
                {...getLineProps({line, key: i})}
                className="table-row"
              >
                {!hide_nums && (
                  <span className={`
                    table-cell px-2 text-right select-none
                    ${highlightColor(i) ? `bg-${highlightColor(i)}-100` : ''}
                  `}>
                    {i+1}
                  </span>
                )}
                <div className={`
                  table-cell
                  pl-2
                  ${highlightColor(i) ?
                    `bg-gradient-to-r from-${highlightColor(i)}-50 to-transparent` : ''}
                `}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
                <div className="w-4" />
              </div>
            )))}
          </pre>
        )}
      </Highlight>
    </>
  )
}

export default CodeBlock
