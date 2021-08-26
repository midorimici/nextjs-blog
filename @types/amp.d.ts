interface AmpHTMLAttributes<T> extends HTMLAttributes {
  type?: string
}

interface AmpInputHTMLAttributes<T> extends InputHTMLAttributes {
  on?: string
}

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

  interface AmpState {
    children?: Element
    id?: string
    src?: string
    credentials?: string
  }

  interface AmpList {
    children?: Element
    src?: string
    'data-amp-bind-src'?: string
    credentials?: string
    items?: string
    'max-items'?: string
    'single-item'?: boolean
    'reset-on-refresh'?: string
    binding?: 'no' | 'refresh' | 'always'
    layout?: 'fill' | 'fixed' | 'fixed-height' | 'flex-item' | 'nodisplay' | 'responsive'
    width?: number | string
    height?: number | string
  }

  interface IntrinsicElements {
    'amp-img': AmpImg
    'amp-state': AmpState
    'amp-list': AmpList
    template: DetailedHTMLProps<AmpHTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>
    input: DetailedHTMLProps<AmpInputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  }
}
