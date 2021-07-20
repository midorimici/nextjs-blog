import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import github from 'prism-react-renderer/themes/github'

type Props = {
  children: string
  className: string
}

const CodeBlock = ({ children, className }: Props) => {
  const lang = className.replace(/language-/, '').split(':')[0] as Language

  return (
    <Highlight {...defaultProps} code={children} language={lang} theme={github}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={{...style, padding: '20px'}}>
          {tokens.map((line, i) => (
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
  )
}

export default CodeBlock
