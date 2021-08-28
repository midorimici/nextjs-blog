import dynamic from 'next/dynamic'

import type { PostFieldsToIndex } from 'types/api'

const PostPreview = dynamic(() => import('./post-preview'))

type Props = {
  posts: PostFieldsToIndex[]
}

const Stories = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 mb-4">
      {posts.map((post, index) => {
        return (
          <PostPreview
            key={post.slug}
            slug={post.slug}
            title={post.title}
            date={post.date}
            lastmod={post.lastmod}
            topics={post.topics}
            coverImageUrl={post.coverImageUrl}
            priority={index <= 1}
            summary={post.summary}
          />
        )
      })}
    </div>
  )
}

export default Stories
