import Head from 'next/head'

import Container from 'components/container'
import Stories from 'components/stories'
import Layout from 'components/layout'
import Pagination from 'components/pagination'
import { getPosts, getTotalPostNumbers, necessaryFieldsForPostList } from 'lib/api'
import { SITE_NAME } from 'lib/constants'
import Post from 'types/post'

type Props = {
  posts: Post[]
  postNumbers: number
}

const Index = ({ posts, postNumbers }: Props) => {
  return (
    <>
      <Layout>
        <Head>
          <title>{SITE_NAME}</title>
        </Head>
        <Container>
          {posts.length > 0 && <Stories posts={posts} />}
        </Container>
        <Pagination postNumbers={postNumbers} />
      </Layout>
    </>
  )
}

export default Index

export const getStaticProps = async () => {
  const posts = getPosts(necessaryFieldsForPostList)
  const postNumbers = getTotalPostNumbers()

  return {
    props: { posts, postNumbers },
  }
}
