import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import Link from 'next/link'

import { useParsedMarkdown } from './useParsedMarkdown'

type Props = {
  slug: string
  title: string
  date: string
  lastmod: string
  summary: string
}

const PostPreview = ({
  slug,
  title,
  date,
  lastmod,
  summary,
}: Props) => {
  const content = useParsedMarkdown(summary)
  
  return (
    <article className={`
      post-preview
      mx-auto
      relative
      rounded-2xl
      cursor-pointer
      transition duration-300
      shadow hover:shadow-lg hover:bg-white
      hover:opacity-80
    `}>
      <Link as={`/posts/${slug}`} href="/posts/[slug]">
        <a className="absolute top-0 left-0 w-full h-full z-10"></a>
      </Link>
      <CoverImage
        title={title}
        src={`/posts/${slug}/index.jpg`}
      />
      <section className="m-4">
        <h3 className="text-3xl mb-3 leading-snug">
          {title}
        </h3>
        <div className="text-lg mb-4">
          <DateFormatter dateString={date} type='date' />
          <DateFormatter dateString={lastmod} type='lastmod' />
        </div>
        {summary && (
          <p
            className="text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </section>
    </article>
  )
}

export default PostPreview
