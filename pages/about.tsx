import Head from 'next/head'

import Layout from 'components/layout'
import AboutPost from 'components/post/about'
import { getAboutPost } from 'lib/api'
import { SITE_NAME } from 'lib/constants'
import { markdownToHtml } from 'lib/markdownToHtml'

export const config = { amp: true }

type Props = {
	postTitle: string
	profileUrl: string
	content: string
}

const About = ({ postTitle, profileUrl, content }: Props) => {
	return (
		<>
			<Head>
				<title>
					{postTitle} | {SITE_NAME}
				</title>
			</Head>
			<Layout>
				<article className="mb-8">
					<div className="max-w-2xl mx-auto">
						<h1
							className={`
                mb-12 text-2xl sm:text-4xl text-left font-bold tracking-wide break-all
              `}
						>
							{postTitle}
						</h1>
						<div className="flex justify-center">
							<amp-img src={profileUrl} alt="プロフィール画像" width={160} height={160} />
						</div>
						<AboutPost content={content} />
					</div>
				</article>
			</Layout>
		</>
	)
}

export default About

export async function getStaticProps() {
	const post = await getAboutPost()

	return {
		props: {
			postTitle: post.title,
			profileUrl: post.profileUrl,
			content: post.content,
		},
	}
}
