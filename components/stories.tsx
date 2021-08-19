import PostPreview from './post-preview'
import type { ContentfulPostFields } from 'types/api'

type Props = {
  posts: ContentfulPostFields[]
}

const Stories = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 mb-4">
      {posts.filter((post) => post.published).map((post) => {
        const coverImage = post.assets.find(asset => asset.fields.file.fileName === '_index.jpg')
        return <PostPreview
          key={post.slug}
          slug={post.slug}
          title={post.title}
          date={post.date}
          lastmod={post.lastmod}
          topics={post.topics.map(topic => topic.fields)}
          coverImageUrl={`https:${coverImage?.fields.file.url ?? ''}`}
          summary={(post.summary ?? post.content.replace(/([\s\S]+)\n<!--more-->[\s\S]+/, '$1')) + '…'}
        />
      })}
    </div>
  )
}

export default Stories
