import Link from 'next/link'

import { brandTopicsMap, topicEmojiSourceMap } from 'lib/topics'

type Props = {
  topic: string
  number?: number
}

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
        <img src={logo} alt={label} className="w-6 sm:w-8 rounded-2xl" />
        {label + (number ? ` (${number})` : '')}
      </a>
    </Link>
  )
}

export default TopicTip
