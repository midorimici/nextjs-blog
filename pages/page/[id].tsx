import Index from 'pages/index'
import Post from 'types/post'
import { getPosts, getTotalPostNumbers, necessaryFieldsForPostList } from 'lib/api'
import { PAGINATION_PER_PAGE } from 'lib/constants'

type Props = {
  posts: Post[]
  postNumbers: number
}

const Posts = ({ posts, postNumbers }: Props) => {
  return (
    <Index posts={posts} postNumbers={postNumbers} />
  )
}

export default Posts

type Params = {
  params: {
    id: number
  }
}

export async function getStaticProps({ params }: Params) {
  const posts = getPosts(necessaryFieldsForPostList, { offset: PAGINATION_PER_PAGE*(params.id-1) })
  const postNumbers = getTotalPostNumbers()

  return {
    props: { posts, postNumbers },
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
