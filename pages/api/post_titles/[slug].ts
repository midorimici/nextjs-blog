import type { NextApiRequest, NextApiResponse } from 'next'

import { getPostBySlug } from 'lib/api'

export default function handler(req: NextApiRequest, res: NextApiResponse<{ title: string }>) {
  const { slug } = req.query
  const post = getPostBySlug(slug as string, ['title'])
  res.status(200).json({ title: post.title ?? '' })
}
