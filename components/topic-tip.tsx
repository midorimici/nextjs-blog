import Link from 'next/link'

import { brandTopicsMap, topicEmojiSourceMap } from 'lib/topics'

type Props = {
  topic: string
  number?: number
}

/* eslint-disable @next/next/no-img-element */

const TopicTip = ({ topic, number }: Props) => {
  const { label, logo } = brandTopicsMap[topic.toLowerCase()]
    ?? { label: topic, logo: topicEmojiSourceMap[topic] ?? 'https://placehold.jp/150x150.png?text=(-%20-)%3F' }
  return (
    <Link as={`/tags/${topic.toLowerCase()}`} href="/tags/[topic]">
      <a className={`
        flex items-center gap-2 p-2
        text-sm sm:text-base
        border-2 rounded-3xl
        z-20
        transition-color duration-300 hover:bg-white
      `}>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-2xl flex justify-center items-center">
          <img
            src={logo}
            alt={label}
            className="w-4 sm:w-6"
          />
        </div>
        {label + (number ? ` (${number})` : '')}
      </a>
    </Link>
  )
}

export default TopicTip
