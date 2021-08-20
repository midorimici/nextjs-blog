import { ReactElement } from 'react'
import Image from 'next/image'

import { useParsedMarkdown } from 'components/useParsedMarkdown'

export type FukidashiProps = {
  children: string | ReactElement
  face?: 'ase' | 'neut' | 'normal'
}

const Fukidashi = ({ children, face = 'normal' }: FukidashiProps) => {
  const content = useParsedMarkdown(children)

  return (
    <div className="flex gap-8">
      <div
        className={`
          fukidashi
          relative flex-grow p-4
          bg-white border-2 border-gray-600 rounded-2xl
          leading-loose
        `}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="flex-shrink-0">
        <Image
          src={`/images/${face}.jpg`}
          alt="みーこ"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
    </div>
  )
}

export default Fukidashi
