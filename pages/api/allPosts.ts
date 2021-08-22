import type { NextApiRequest, NextApiResponse } from 'next'

import { ContentfulPostFields } from 'types/api'
import { getAllPosts, necessaryFieldsForPostList } from 'lib/api'

type Data = {
  posts: ContentfulPostFields[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const posts = await getAllPosts(necessaryFieldsForPostList)
  res.status(200).json({ posts })
}
