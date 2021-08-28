import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

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
