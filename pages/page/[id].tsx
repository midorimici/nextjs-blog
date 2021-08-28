import Index from 'pages/index'
import type { PostFieldsToIndex } from 'types/api'
import { getPosts, pageCount } from 'lib/api'
import { PAGINATION_PER_PAGE } from 'lib/constants'

export const config = { amp: true }

type Props = {
	posts: Omit<PostFieldsToIndex, 'content'>[]
	pageCount: number
}

const Posts = (props: Props) => {
	return <Index {...props} />
}

export default Posts

type Params = {
	params: {
		id: number
	}
}

export async function getStaticProps({ params }: Params) {
	const posts = await getPosts({ offset: PAGINATION_PER_PAGE * (params.id - 1) })
	const count = await pageCount

	return {
		props: {
			posts,
			pageCount: count,
		},
	}
}

export async function getStaticPaths() {
	const ids = [...Array(await pageCount)].map((_, i) => i + 1)

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
