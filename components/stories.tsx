import PostPreview from './post-preview'
import Post from '../types/post'

type Props = {
  posts: Post[]
}

const Stories = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 mb-4">
      {posts.filter((post) => !post.draft).map((post) => (
        <PostPreview
          key={post.slug}
          slug={post.slug}
          title={post.title}
          date={post.date}
          lastmod={post.lastmod}
          summary={(post.summary ?? post.content.replace(/([\s\S]+)\n<!--more-->[\s\S]+/, '$1')) + '…'}
        />
      ))}
    </div>
  )
}

export default Stories
