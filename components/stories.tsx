import dynamic from 'next/dynamic'

import type { ContentfulPostFields } from 'types/api'
import { HOME_OG_IMAGE_URL } from 'lib/constants'

const PostPreview = dynamic(() => import('./post-preview'))

type Props = {
  posts: ContentfulPostFields[]
  titles: string[]
  summaries: string[]
}

const Stories = ({ posts, titles, summaries }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8 gap-y-8 mb-4">
      {posts.map((post, index) => {
        const coverImage = post.assets?.find(asset => asset.fields.file.fileName === '_index.jpg')
        return <PostPreview
          key={post.slug}
          slug={post.slug}
          title={titles[index]}
          date={post.date}
          lastmod={post.lastmod}
          topics={post.topics.map(topic => topic.fields)}
          coverImageUrl={
            `https:${coverImage?.fields.file.url ?? HOME_OG_IMAGE_URL.slice(6)}`
          }
          summary={summaries[index]}
        />
      })}
    </div>
  )
}

export default Stories
