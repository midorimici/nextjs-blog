// import { useState, useEffect } from 'react'
// import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'
// import ReactPaginate from 'react-paginate'

// import { PAGINATION_PER_PAGE } from 'lib/constants'

const Pagination = ({ pageCount }: { pageCount: number }) => {
	const router = useRouter()
	const page = +(router.query.id ?? 1)
	// const [pageCount, setPageCount] = useState(10)
	// const { data } = useSWR(
	// 	'/api/allPosts',
	// 	async (url: string) => await fetch(url).then((res) => res.json())
	// )

	// useEffect(() => {
	// 	if (data) setPageCount(Math.ceil(data.posts.length / PAGINATION_PER_PAGE))
	// }, [data])

	return (
		<>
			<amp-state id="page-count">
				<script
					type="application/json"
					dangerouslySetInnerHTML={{ __html: `{ "count": ${pageCount} }` }}
				/>
			</amp-state>
			<amp-list
				src="amp-state:page-count"
				layout="fixed-height"
				height="3rem"
				items="."
				single-item
			>
				<template type="amp-mustache">
					<ul className="pagination mt-8 flex justify-center list-none">
						<li>
							{page === 1 ? (
								`<`
							) : (
								<Link href={page > 2 ? `/page/${page - 1}` : '/'}>
									<a>{`<`}</a>
								</Link>
							)}
						</li>
						<li>{`${page} / {{count}}`}</li>
						<li>
							{page === pageCount ? (
								`>`
							) : (
								<Link href={`/page/${page + 1}`}>
									<a>{`>`}</a>
								</Link>
							)}
						</li>
					</ul>
				</template>
			</amp-list>
		</>
		// <ReactPaginate
		// 	pageCount={pageCount}
		// 	pageRangeDisplayed={3}
		// 	marginPagesDisplayed={2}
		// 	initialPage={router.query.id ? +router.query.id - 1 : 0}
		// 	onPageChange={({ selected }) => { router.push(selected === 0 ? '/' : `/page/${selected+1}`)}}
		// 	previousLabel="<"
		// 	nextLabel=">"
		// 	containerClassName="mt-8 flex justify-center list-none"
		// 	pageClassName="mx-2 sm:mx-4 text-lg sm:text-4xl"
		// 	pageLinkClassName="outline-none cursor-pointer"
		// 	breakClassName="mx-4"
		// 	breakLinkClassName="outline-none cursor-pointer"
		// 	previousClassName="mx-2 sm:mr-4 text-lg sm:text-4xl"
		// 	previousLinkClassName="outline-none cursor-pointer"
		// 	nextClassName="mx-2 sm:ml-4 text-lg sm:text-4xl"
		// 	nextLinkClassName="outline-none cursor-pointer"
		// 	activeClassName="text-pink-400"
		// 	activeLinkClassName="outline-none cursor-pointer"
		// 	disabledClassName="invisible"
		// />
	)
}

export default Pagination
