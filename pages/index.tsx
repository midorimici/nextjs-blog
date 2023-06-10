import { useState, useEffect, ChangeEvent } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faSearch, faSun } from '@fortawesome/free-solid-svg-icons'

import Container from 'components/container'
import Stories from 'components/stories'
import Layout from 'components/layout'
import Pagination from 'components/pagination'
import { getPosts } from 'lib/api'
import { SITE_NAME } from 'lib/constants'
import type { PostFieldsToIndex } from 'types/api'

type StatusProps = {
  timeoutID: number | undefined
  isValidating: boolean
  searchText: string
  postCount: number
}

const Status = ({ timeoutID, isValidating, searchText, postCount }: StatusProps) => {
  if (timeoutID !== undefined) {
    return <FontAwesomeIcon icon={faEllipsis} width={20} className="ml-4" />
  }

  if (isValidating) {
    return <FontAwesomeIcon icon={faSun} width={20} className="ml-4 animate-spin" />
  }

  if (searchText === '') {
    return null
  }

  return <>{`${postCount} 件の記事`}</>
}

type Props = {
  posts: PostFieldsToIndex[]
}

const Index = ({ posts }: Props) => {
  const [searchText, setSearchText] = useState('')
  const [timeoutID, setTimeoutID] = useState<number>()
  const [searchedPosts, setSearchedPosts] = useState<PostFieldsToIndex[]>([])
  const [allPosts, setAllPosts] = useState<PostFieldsToIndex[]>([])
  const [fetchPosts, setFetchPosts] = useState(false)
  const { data, isValidating } = useSWR(
    fetchPosts ? '/api/allPosts' : null,
    async (url: string) => await fetch(url).then((res) => res.json())
  )

  useEffect(() => {
    if (allPosts.length === 0 && searchText !== '') setFetchPosts(true)
  }, [searchText])

  useEffect(() => {
    if (data) setAllPosts(data.posts)
  }, [fetchPosts])

  useEffect(() => {
    const getSearchedPosts = () =>
      allPosts.filter((post: PostFieldsToIndex) => {
        const content =
          post.content
            .replace(/<relpos link=".+?" ?\/>/g, '')
            .replace(/<pstlk label="(.+?)" to=".+?" ?\/>/g, '$1')
            .replace(/\[(.+?)\]\(.+?\)/g, '$1') || ''
        return searchText.split(' ').every((query: string) => new RegExp(query, 'i').test(content))
      })

    setSearchedPosts(getSearchedPosts())
    return () => clearTimeout(timeoutID)
  }, [searchText, allPosts])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutID)
    setTimeoutID(
      window.setTimeout(() => {
        setSearchText(e.target.value)
        setTimeoutID(undefined)
      }, 300)
    )
  }

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
      </Head>
      <Layout>
        <div className="mb-8">
          <div className="px-4 py-2 flex gap-4 items-center border rounded-xl bg-white text-gray-600">
            <FontAwesomeIcon icon={faSearch} width={20} />
            <input
              type="search"
              placeholder="記事を検索"
              className="outline-none flex-grow"
              onChange={handleChange}
            />
          </div>
          <div className="h-8 mt-4">
            <Status
              timeoutID={timeoutID}
              isValidating={isValidating}
              searchText={searchText}
              postCount={searchedPosts.length}
            />
          </div>
        </div>
        <Container>
          {posts.length > 0 && <Stories posts={searchText === '' ? posts : searchedPosts} />}
        </Container>
        {searchText === '' && <Pagination />}
      </Layout>
    </>
  )
}

export default Index

export const getStaticProps = async () => {
  const posts = await getPosts()

  return {
    props: { posts },
  }
}
