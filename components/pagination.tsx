import Link from 'next/link'
import { useRouter } from 'next/router'

const Pagination = ({ pageCount }: { pageCount: number }) => {
	const router = useRouter()
	const page = +(router.query.id ?? 1)

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
	)
}

export default Pagination
