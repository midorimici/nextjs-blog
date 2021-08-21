import Index from 'pages/index'
import type { ContentfulPostFields } from 'types/api'
import { getAllPosts, getTotalPostNumbers, necessaryFieldsForPostList } from 'lib/api'
import { PAGINATION_PER_PAGE } from 'lib/constants'

type Props = {
  posts: ContentfulPostFields[]
  allPosts: ContentfulPostFields[]
}

const Posts = ({ posts, allPosts }: Props) => {
  return (
    <Index posts={posts} allPosts={allPosts} />
  )
}

export default Posts

type Params = {
  params: {
    id: number
  }
}

export async function getStaticProps({ params }: Params) {
  const allPosts = await getAllPosts(necessaryFieldsForPostList)
  const posts = allPosts.slice(PAGINATION_PER_PAGE*(params.id-1), PAGINATION_PER_PAGE*(params.id))

  return {
    props: { posts, allPosts },
  }
}

export async function getStaticPaths() {
  const postNumbers = await getTotalPostNumbers()
  const ids = [...Array(Math.ceil(postNumbers/PAGINATION_PER_PAGE))].map((_, i) => i+1)

  return {
    paths: ids.map((id) => {
      return {
        params: {
          id: String(id),
        },
      }
    }),
    fallback: false,
  }
}
