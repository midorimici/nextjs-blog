import type { NextApiRequest, NextApiResponse } from 'next'

import { PostFieldsToIndex } from 'types/api'
import { allPosts, getPosts } from 'lib/api'
import { PAGINATION_PER_PAGE } from 'lib/constants'

type Data = {
	posts: Omit<PostFieldsToIndex, 'content'>[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { query } = req.query as { query: string }
	if (query === '') {
		const page = req.headers.referer?.split('page/')[1]
		let option = {}
		if (page) {
			option = { offset: PAGINATION_PER_PAGE * (+page - 1) }
		}
		const posts = await getPosts(option)
		res.status(200).json({ posts })
		return
	}

	const posts = await allPosts
	const filteredPosts = posts.filter((post: PostFieldsToIndex) => {
		const content =
			post.content
				.replace(/<relpos link=".+?" ?\/>/g, '')
				.replace(/<pstlk label="(.+?)" to=".+?" ?\/>/g, '$1')
				.replace(/\[(.+?)\]\(.+?\)/g, '$1') || ''
		return new RegExp(query, 'i').test(content)
	})
	res.status(200).json({ posts: filteredPosts })
}
