import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import vsDark from 'prism-react-renderer/themes/vsDark'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faCopy, faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons'

import { useHighlightLineNumbers } from './useHighlightLineNumbers'
import { useInlineHighlightIndices } from './useInlineHighlightIndices'
import { useCodeCopyHandler } from './useCodeCopyHandler'
import { theme } from './codeTheme'

const Overlay = dynamic(() => import('./overlay'), { ssr: false })

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

const actionButtonStyle = `
w-8 h-8 bg-gray-400 bg-opacity-60
transition-colors duration-300 hover:bg-pink-400
`

const CodeBlock = ({
  children,
  className,
  name,
  hide_nums,
  hl_lines,
  ins,
  del,
  inline_hl,
}: CodeBlockProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const lang = (className ? className.replace(/language-/, '') : 'txt') as Language
  const isHighlighted = useHighlightLineNumbers(hl_lines)
  const isInserted = useHighlightLineNumbers(ins)
  const isDeleted = useHighlightLineNumbers(del)
  const isHighlightedInline = useInlineHighlightIndices(inline_hl)

  const highlightColor = (i: number) => {
    if (isHighlighted(i)) return 'yellow'
    else if (isInserted(i)) return 'green'
    else if (isDeleted(i)) return 'red'
  }

  const { successed, handleCopyClick } = useCodeCopyHandler(children)
  const [zoomCode, setZoomCode] = useState(false)

  const codeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsDarkMode(matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  return (
    <>
      {zoomCode && <Overlay hide={() => setZoomCode(false)} targetRef={codeRef} />}
      <div
        ref={codeRef}
        className={`my-4 sm:origin-center sm:transition-transform sm:duration-300
          ${zoomCode ? ' z-30 relative sm:transform sm:scale-150' : ''}
        `}
      >
        {name && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-t border-b font-code text-sm whitespace-pre-wrap break-words">
            {name}
          </span>
        )}
        <div className={`relative${zoomCode ? ' w-max min-w-fill-available' : ''}`}>
          <Highlight
            {...defaultProps}
            code={children}
            language={lang}
            theme={isDarkMode ? vsDark : theme}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-4 text-sm overflow-auto`} style={style}>
                <div>
                  {tokens.map(
                    (line, lineIndex) =>
                      !(lineIndex === tokens.length - 1 && line[0].empty) && (
                        <div
                          key={lineIndex}
                          {...getLineProps({ line, key: lineIndex })}
                          className="table-row"
                        >
                          {!hide_nums && (
                            <span
                              className={`
                          table-cell px-2 text-right select-none
                          ${
                            highlightColor(lineIndex)
                              ? `bg-${highlightColor(lineIndex)}-${isDarkMode ? 800 : 100}`
                              : ''
                          }
                        `}
                            >
                              {lineIndex + 1}
                            </span>
                          )}
                          <div
                            className={`
                        table-cell
                        pl-2
                        ${
                          highlightColor(lineIndex)
                            ? `bg-gradient-to-r from-${highlightColor(lineIndex)}-${
                                isDarkMode ? 900 : 50
                              } to-transparent`
                            : ''
                        }
                      `}
                          >
                            {line.map((token, key) => (
                              <span
                                key={key}
                                {...getTokenProps({ token, key })}
                                className={
                                  isHighlightedInline(lineIndex, key)
                                    ? `bg-${highlightColor(lineIndex)}-${isDarkMode ? 800 : 100}
                              border-${highlightColor(lineIndex)}-300 border-b-2`
                                    : ''
                                }
                              />
                            ))}
                          </div>
                          <div className="w-4" />
                        </div>
                      )
                  )}
                </div>
                <div className={`absolute ${zoomCode ? '-top-8' : 'top-0'} right-0 flex gap-2`}>
                  <button
                    title={zoomCode ? '戻す' : '拡大する'}
                    aria-label={zoomCode ? '戻す' : '拡大する'}
                    onClick={() => setZoomCode(!zoomCode)}
                    className={actionButtonStyle}
                  >
                    <FontAwesomeIcon
                      icon={zoomCode ? faSearchMinus : faSearchPlus}
                      color="#ffffff"
                      className="align-middle"
                    />
                  </button>
                  <button
                    title="コードをコピー"
                    aria-label="コードをコピー"
                    onClick={() => handleCopyClick()}
                    className={actionButtonStyle}
                  >
                    <FontAwesomeIcon
                      icon={successed ? faCheck : faCopy}
                      color="#ffffff"
                      className="align-middle"
                    />
                  </button>
                </div>
              </pre>
            )}
          </Highlight>
        </div>
      </div>
    </>
  )
}

export default CodeBlock
