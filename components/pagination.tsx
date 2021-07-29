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
    />
  )
}

export default Pagination
