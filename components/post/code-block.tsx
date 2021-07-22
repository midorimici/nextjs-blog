import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import github from 'prism-react-renderer/themes/github'

type Props = {
  children: string
  className: string
}

const CodeBlock = ({ children, className }: Props) => {
  const [lang, fileName] = className.replace(/language-/, '').split(':')

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
        language={lang as Language}
        theme={github}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={`${className} p-4 text-sm overflow-auto`} style={style}>
            {tokens.map((line, i) => (!(i === tokens.length - 1 && line[0].empty) &&
              <div key={i} {...getLineProps({line, key: i})} className="table-row">
                <span className="table-cell text-right select-none">
                  {i+1}
                </span>
                <div className="table-cell pl-4">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </>
  )
}

export default CodeBlock
