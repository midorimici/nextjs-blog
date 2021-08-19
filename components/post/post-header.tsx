import DateFormatter from '../date-formatter'
import PostTitle from './post-title'

import TopicTip from 'components/topic-tip'
import type { ContentfulTopicFields } from 'types/api'

type Props = {
  title: string
  date: string
  lastmod: string
  topics: ContentfulTopicFields[]
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
        {topics.map((topic: ContentfulTopicFields) => <TopicTip key={topic.id} topic={topic} />)}
      </div>
    </div>
  )
}

export default PostHeader
