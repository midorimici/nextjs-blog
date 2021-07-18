import DateFormatter from '../date-formatter'
import PostTitle from './post-title'

type Props = {
  title: string
  date: string
  lastmod: string
}

const PostHeader = ({ title, date, lastmod }: Props) => {
  return (
    <div className="max-w-2xl mx-auto">
      <PostTitle>{title}</PostTitle>
      <div className="mb-6 text-lg">
        <DateFormatter dateString={date} type='date' />
        <DateFormatter dateString={lastmod} type='lastmod' />
      </div>
    </div>
  )
}

export default PostHeader
