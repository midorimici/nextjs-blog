// import { useState, useEffect, ChangeEvent } from 'react'
// import useSWR from 'swr'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSun } from '@fortawesome/free-solid-svg-icons'

import Container from 'components/container'
import Layout from 'components/layout'
import AmpStories from 'components/amp-stories'
import Pagination from 'components/pagination'
import { getPosts } from 'lib/api'
import { SITE_NAME } from 'lib/constants'
import type { PostFieldsToIndex } from 'types/api'

export const config = { amp: true }

type Props = {
  posts: PostFieldsToIndex[]
}

const Index = ({ posts }: Props) => {
  // const [searchText, setSearchText] = useState('')
  // const [timeoutID, setTimeoutID] = useState<number>()
  // const [searchedPosts, setSearchedPosts] = useState<ContentfulPostFields[]>([])
  // const [allPosts, setAllPosts] = useState<ContentfulPostFields[]>([])
  // const [fetchPosts, setFetchPosts] = useState(false)
  // const [refetchToggle, setRefetchToggle] = useState(false)
  // const { data } = useSWR(
  //   fetchPosts ? '/api/allPosts' : null,
  //   async (url: string) => await fetch(url).then(res => res.json()),
  // )

  // useEffect(() => {
  //   if (allPosts.length === 0 && searchText !== '') setFetchPosts(true)
  // }, [searchText])

  // useEffect(() => {
  //   if (data) setAllPosts(data.posts)
  //   else {
  //     setTimeout(() => setRefetchToggle(prev => !prev), 200)
  //   }
  // }, [fetchPosts, refetchToggle])
  
  // useEffect(() => {
  //   const getSearchedPosts = () =>
  //     allPosts.filter(
  //       (post: ContentfulPostFields) => {
  //         const content = post.content
  //           .replace(/<relpos link=".+?" ?\/>/g, '')
  //           .replace(/<pstlk label="(.+?)" to=".+?" ?\/>/g, '$1')
  //           .replace(/\[(.+?)\]\(.+?\)/g, '$1') || ''
  //         return (new RegExp(searchText, 'i')).test(content)
  //       }
  //     )

  //   setSearchedPosts(getSearchedPosts())
  //   return () => clearTimeout(timeoutID)
  // }, [searchText, allPosts])

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   clearTimeout(timeoutID)
  //   setTimeoutID(window.setTimeout(() => setSearchText(e.target.value), 200))
  // }

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
      </Head>
      <Layout>
        <div className="mb-8">
          <div className="px-4 py-2 flex gap-4 items-center border rounded-xl bg-white">
            <FontAwesomeIcon icon={faSearch} width={20} />
            <amp-state id="searchText">
              <script
                type="application/json"
                dangerouslySetInnerHTML={{ __html: `{ "searchText": "" }` }}
              />
            </amp-state>
            <input
              type="search"
              placeholder="記事を検索"
              className="outline-none flex-grow"
              on="input-debounced:AMP.setState({searchText: event.value})"
            />
          </div>
          <amp-state id="posts">
            <script
              type="application/json"
              dangerouslySetInnerHTML={{ __html: `{ "posts": ${JSON.stringify(posts)} }` }}
            />
          </amp-state>
          {/* {searchText && (
            <div className="mt-4">
              {
                searchedPosts.length
                ? `${searchedPosts.length} 件の記事`
                : <FontAwesomeIcon icon={faSun} width={20} className="text-yellow-500 animate-spin" />
              }
            </div>
          )} */}
        </div>
        <Container>
          <AmpStories />
        </Container>
        <div data-amp-bind-class="searchText ? 'hidden' : 'block'">
          <Pagination />
        </div>
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
