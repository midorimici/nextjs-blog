import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import ReactPaginate from 'react-paginate'

import { PAGINATION_PER_PAGE } from 'lib/constants'

const Pagination = () => {
  const router = useRouter()
  const [pageCount, setPageCount] = useState(10)
  const { data } = useSWR(
    '/api/allPosts',
    async (url: string) => await fetch(url).then((res) => res.json())
  )

  useEffect(() => {
    if (data) setPageCount(Math.ceil(data.posts.length / PAGINATION_PER_PAGE))
  }, [data])

  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      initialPage={router.query.id ? +router.query.id - 1 : 0}
      onPageChange={({ selected }) => {
        router.push(selected === 0 ? '/' : `/page/${selected + 1}`)
      }}
      previousLabel="<"
      nextLabel=">"
      containerClassName="mt-8 flex justify-center"
      pageClassName="mx-2 sm:mx-4 text-lg sm:text-4xl"
      pageLinkClassName="outline-none cursor-pointer"
      breakClassName="mx-4"
      breakLinkClassName="outline-none cursor-pointer"
      previousClassName="mx-2 sm:mr-4 text-lg sm:text-4xl"
      previousLinkClassName="outline-none cursor-pointer"
      nextClassName="mx-2 sm:ml-4 text-lg sm:text-4xl"
      nextLinkClassName="outline-none cursor-pointer"
      activeClassName="text-pink-400"
      activeLinkClassName="outline-none cursor-pointer"
      disabledClassName="invisible"
    />
  )
}

export default Pagination
