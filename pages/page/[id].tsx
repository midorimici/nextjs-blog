import Index from 'pages/index'
import Post from 'types/post'
import { getPosts, getTotalPostNumbers, necessaryFieldsForPostList } from 'lib/api'
import { PAGINATION_PER_PAGE } from 'lib/constants'

type Props = {
  posts: Post[]
  allPosts: Post[]
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
  const allPosts = getPosts(necessaryFieldsForPostList, { all: true })
  const posts = allPosts.slice(PAGINATION_PER_PAGE*(params.id-1), PAGINATION_PER_PAGE*params.id)

  return {
    props: { posts, allPosts },
  }
}

export async function getStaticPaths() {
  const postNumbers = getTotalPostNumbers()
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
