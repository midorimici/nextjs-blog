import Link from 'next/link'

import DateFormatter from './date-formatter'
import CoverImage from './cover-image'
import TopicTip from './topic-tip'
import type { ContentfulTopicFields } from 'types/api'

type Props = {
	slug: string
	title: string
	date: string
	lastmod: string
	topics: ContentfulTopicFields[]
	coverImageUrl: string
	summary: string
}

const PostPreview = ({ slug, title, date, lastmod, topics, coverImageUrl, summary }: Props) => {
	return (
		<article
			className={`
        post-preview
        relative
        mx-auto
        rounded-2xl
        cursor-pointer
        transition duration-300
        shadow hover:shadow-lg hover:bg-white
        hover:opacity-80
        break-all
      `}
		>
			<Link as={`/posts/${slug}`} href="/posts/[slug]">
				<a className="absolute top-0 left-0 w-full h-full z-10" aria-label={title} />
			</Link>
			<CoverImage title={title} src={coverImageUrl} />
			<section className="m-4">
				<h3
					className="text-xl sm:text-3xl mb-3 leading-snug"
					dangerouslySetInnerHTML={{ __html: title }}
				/>
				<div className="mb-4">
					<DateFormatter date={date} type="date" />
					<DateFormatter date={lastmod} type="lastmod" />
				</div>
				<div className="flex flex-wrap gap-4 mb-4">
					{topics.map((topic: ContentfulTopicFields) => (
						<TopicTip key={topic.id} topic={topic} />
					))}
				</div>
				<div
					className="text-base sm:text-lg leading-relaxed"
					dangerouslySetInnerHTML={{ __html: summary }}
				/>
			</section>
		</article>
	)
}

export default PostPreview
