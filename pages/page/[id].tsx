import Index from 'pages/index'
import type { PostFieldsToIndex } from 'types/api'
import { getPosts, getTotalPostNumbers } from 'lib/api'
import { PAGINATION_PER_PAGE } from 'lib/constants'

type Props = {
  posts: PostFieldsToIndex[]
}

const Posts = ({ posts }: Props) => {
  return (
    <Index posts={posts} />
  )
}

export default Posts

type Params = {
  params: {
    id: number
  }
}

export async function getStaticProps({ params }: Params) {
  const posts = await getPosts({ offset: PAGINATION_PER_PAGE*(params.id-1) })

  return {
    props: { posts },
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
