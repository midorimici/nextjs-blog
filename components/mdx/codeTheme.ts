import type { PrismTheme } from 'prism-react-renderer'

export const theme: PrismTheme = {
  plain: {
    color: 'rgb(75, 85, 99)',
    backgroundColor: 'rgb(243, 244, 246)',
  },
  styles: [
    {
      types: ['changed'],
      style: {
        color: 'rgb(255, 238, 128)',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: 'rgba(239, 83, 80, 0.56)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(173, 219, 103)',
      },
    },
    {
      types: ['comment'],
      style: {
        color: 'rgb(185, 28, 28)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(31, 41, 55)',
      },
    },
    {
      types: ['string', 'url'],
      style: {
        color: 'rgb(16, 185, 129)',
      },
    },
    {
      types: ['number', 'boolean'],
      style: {
        color: 'rgb(167, 139, 250)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: 'rgb(236, 72, 153)',
      },
    },
    {
      types: [
        'keyword',
        'operator',
        'property',
        'namespace',
        'tag',
        'selector',
        'doctype',
      ],
      style: {
        color: 'rgb(96, 165, 250)',
      },
    },
    {
      types: ['builtin', 'char', 'constant', 'variable', 'function', 'class-name'],
      style: {
        color: 'rgb(245, 158, 11)',
      },
    },
  ],
}
