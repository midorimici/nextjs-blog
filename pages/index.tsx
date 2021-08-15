import { useState, useEffect, ChangeEvent } from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import Container from 'components/container'
import Stories from 'components/stories'
import Layout from 'components/layout'
import Pagination from 'components/pagination'
import { getPosts, necessaryFieldsForPostList } from 'lib/api'
import { PAGINATION_PER_PAGE, SITE_NAME } from 'lib/constants'
import type Post from 'types/post'

type Props = {
  posts: Post[]
  allPosts: Post[]
}

const Index = ({ posts, allPosts }: Props) => {
  const [searchText, setSearchText] = useState('')
  const [timeoutID, setTimeoutID] = useState<number>()
  const [searchedPosts, setSearchedPosts] = useState<Post[]>([])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setSearchedPosts(getSearchedPosts())
    return () => clearTimeout(timeoutID)
  }, [searchText])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutID)
    setTimeoutID(window.setTimeout(() => setSearchText(e.target.value), 200))
  }

  const getSearchedPosts = () =>
    allPosts.filter(
      (post: Post) => {
        const content = post.content
          .replace(/<relpos link=".+?" ?\/>/g, '')
          .replace(/<pstlk label="(.+?)" to=".+?" ?\/>/g, '$1')
          .replace(/\[(.+?)\]\(.+?\)/g, '$1') || ''
        return (new RegExp(searchText, 'i')).test(content)
      }
    )

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
      </Head>
      <Layout>
        <div className="mb-8">
          <div className="px-4 py-2 flex gap-4 items-center border rounded-xl bg-white">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="search"
              placeholder="記事を検索"
              className="outline-none flex-grow"
              onChange={handleChange}
            />
          </div>
          {searchText && (
            <div className="mt-4">
              {searchedPosts.length} 件の記事
            </div>
          )}
        </div>
        <Container>
          {posts.length > 0 && <Stories posts={searchText === '' ? posts : searchedPosts} />}
        </Container>
        {searchText === '' && <Pagination postNumbers={allPosts.length} />}
      </Layout>
    </>
  )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = getPosts(necessaryFieldsForPostList, { all: true })
  const posts = allPosts.slice(0, PAGINATION_PER_PAGE)

  return {
    props: { posts, allPosts },
  }
}
