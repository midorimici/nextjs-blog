import { useRouter } from 'next/router'
import ReactPaginate from 'react-paginate'

import { PAGINATION_PER_PAGE } from '../lib/constants'

type Props = {
  postNumbers: number
}

const Pagination = ({ postNumbers }: Props) => {
  const router = useRouter()
  
  return (
    <ReactPaginate
      pageCount={Math.ceil(postNumbers/PAGINATION_PER_PAGE)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      initialPage={router.query.id ? +router.query.id-1 : 0}
      onPageChange={({ selected }) => { router.push(selected === 0 ? '/' : `/page/${selected+1}`)}}
      previousLabel='<'
      nextLabel='>'
      containerClassName="mt-8 flex justify-center"
      pageClassName="mx-4 text-4xl"
      pageLinkClassName="outline-none"
      breakClassName="mx-4"
      breakLinkClassName="outline-none"
      previousClassName="mr-4 text-4xl"
      previousLinkClassName="outline-none"
      nextClassName="ml-4 text-4xl"
      nextLinkClassName="outline-none"
      activeClassName="text-pink-400"
      activeLinkClassName="outline-none"
      disabledClassName="invisible"
    />
  )
}

export default Pagination
