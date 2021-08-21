import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'
import twemoji from 'twemoji'

import TopicTip from './topic-tip'
import type { ContentfulTopicFields } from 'types/api'
import { useParsedMarkdown } from './useParsedMarkdown'

type Props = {
  slug: string
  title: string
  date: string
  lastmod: string
  topics: ContentfulTopicFields[]
  coverImageUrl: string
  priority: boolean
  summary: string
}

const PostPreview = ({
  slug,
  title,
  date,
  lastmod,
  topics,
  coverImageUrl,
  priority,
  summary,
}: Props) => {
  const parsedTitle = useParsedMarkdown(title)
  const content = useParsedMarkdown(twemoji.parse(summary))
  
  return (
    <article className={`
      post-preview
      relative
      mx-auto
      rounded-2xl
      cursor-pointer
      transition duration-300
      shadow hover:shadow-lg hover:bg-white
      hover:opacity-80
      break-all
    `}>
      <Link as={`/posts/${slug}`} href="/posts/[slug]">
        <a className="absolute top-0 left-0 w-full h-full z-10" aria-label={title} />
      </Link>
      <CoverImage
        title={title}
        src={coverImageUrl}
        priority={priority}
      />
      <section className="m-4">
        <h3
          className="text-xl sm:text-3xl mb-3 leading-snug"
          dangerouslySetInnerHTML={{ __html: parsedTitle }}
        />
        <div className="mb-4">
          <DateFormatter dateString={date} type='date' />
          <DateFormatter dateString={lastmod} type='lastmod' />
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {topics.map((topic: ContentfulTopicFields) => <TopicTip key={topic.id} topic={topic} />)}
        </div>
        {summary && (
          <p
            className="text-base sm:text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.replace(/className=/g, 'class=') }}
          />
        )}
      </section>
    </article>
  )
}

export default PostPreview
