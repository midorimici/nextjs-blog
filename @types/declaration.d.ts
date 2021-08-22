declare module 'remark-html'
declare module 'markdown-toc'
declare module '*.css'

declare namespace JSX {
  interface AmpImg {
    children?: Element
    alt?: string
    src?: string
    width?: number | string
    height?: number | string
    layout?: 'fill' | 'fixed' | 'fixed-height' | 'flex-item' | 'intrinsic' | 'nodisplay' | 'responsive'
    className?: string
  }

  interface IntrinsicElements {
    'amp-img': AmpImg
  }
}
