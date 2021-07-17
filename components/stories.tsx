import PostPreview from './post-preview'
import Post from '../types/post'

type Props = {
  posts: Post[]
}

const Stories = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 mb-4">
      {posts.map((post) => (
        <PostPreview
          key={post.slug}
          title={post.title}
          date={post.date}
          lastmod={post.lastmod}
          slug={post.slug}
          excerpt={post.excerpt}
        />
      ))}
    </div>
  )
}

export default Stories
