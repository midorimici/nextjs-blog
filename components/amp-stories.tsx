import Link from 'next/link'

import CoverImage from './cover-image'
import DateFormatter from './date-formatter'

const AmpStories = () => {
	return (
		<amp-list
			src="amp-state:posts"
			data-amp-bind-src="'/api/posts?query=' + searchText"
			items="posts"
			layout="flex-item"
		>
			<template type="amp-mustache">
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
					<Link as="/posts/{{slug}}" href="/posts/[slug]">
						<a className="absolute top-0 left-0 w-full h-full z-10" aria-label="{{title}}" />
					</Link>
					<CoverImage title="{{title}}" src="{{coverImageUrl}}" />
					<section className="m-4">
						<h3
							className="text-xl sm:text-3xl mb-3 leading-snug"
							dangerouslySetInnerHTML={{ __html: '{{title}}' }}
						/>
						<div className="mb-4">
							<DateFormatter date="{{date}}" type="date" />
							<DateFormatter date="{{lastmod}}" type="lastmod" />
						</div>
						<div
							className="flex flex-wrap gap-4 mb-4"
							dangerouslySetInnerHTML={{
								__html: `{{/topics}}`,
							}}
						></div>
						<div
							className="text-base sm:text-lg leading-relaxed"
							dangerouslySetInnerHTML={{ __html: '{{{summary}}}' }}
						/>
					</section>
				</article>
			</template>
		</amp-list>
	)
}

export default AmpStories
