import DateFormatter from '../date-formatter'
import PostTitle from './post-title'

import TopicTip from 'components/topic-tip'

type Props = {
  title: string
  date: string
  lastmod: string
  topics: string[]
}

const PostHeader = ({ title, date, lastmod, topics }: Props) => {
  return (
    <div className="max-w-2xl mx-auto">
      <PostTitle title={title} />
      <div className="mb-6 text-lg">
        <DateFormatter dateString={date} type='date' />
        <DateFormatter dateString={lastmod} type='lastmod' />
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        {topics.map((topic: string) => <TopicTip key={topic} topic={topic} />)}
      </div>
    </div>
  )
}

export default PostHeader
