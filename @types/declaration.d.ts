declare module 'remark-html'
declare module 'markdown-toc'
declare module '*.css'

declare namespace JSX {
  interface AmpImg {
    children?: Element
    alt?: string
    src?: string
    width?: number
    height?: number
    layout?: string
    className?: string
  }

  interface IntrinsicElements {
    'amp-img': AmpImg
  }
}
