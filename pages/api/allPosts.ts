import type { NextApiRequest, NextApiResponse } from 'next'

import { PostFieldsToIndex } from 'types/api'
import { allPosts } from 'lib/api'

type Data = {
  posts: PostFieldsToIndex[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const posts = await allPosts
  res.status(200).json({ posts })
}
