import PostPreview from './post-preview'
import type { PostFieldsToIndex } from 'types/api'

type Props = {
  posts: PostFieldsToIndex[]
}

const Stories = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 mb-4">
      {posts.map((post) => (
        <PostPreview
          key={post.slug}
          slug={post.slug}
          title={post.title}
          date={post.date}
          lastmod={post.lastmod}
          topics={post.topics}
          coverImageUrl={post.coverImageUrl}
          summary={post.summary}
        />
      ))}
    </div>
  )
}

export default Stories
