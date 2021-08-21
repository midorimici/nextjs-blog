import Link from 'next/link'

import type { ContentfulTopicFields } from 'types/api'

type Props = {
  topic: ContentfulTopicFields
  number?: number
}

/* eslint-disable @next/next/no-img-element */

const TopicTip = ({ topic, number }: Props) => {
  return (
    <Link as={`/tags/${topic.id}`} href="/tags/[topic]">
      <a className={`
        flex items-center gap-2 p-2
        text-sm sm:text-base
        border-2 rounded-3xl
        z-20
        transition-color duration-300 hover:bg-white
      `}>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-2xl flex justify-center items-center">
          <img
            src={topic.logoUrl}
            alt={topic.label}
            width={16}
            height={16}
            className="w-4 sm:w-6"
          />
        </div>
        {topic.label + (number ? ` (${number})` : '')}
      </a>
    </Link>
  )
}

export default TopicTip
