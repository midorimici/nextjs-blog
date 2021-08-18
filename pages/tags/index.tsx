import Head from 'next/head'

import Layout from 'components/layout'
import TopicTip from 'components/topic-tip'
import { SITE_NAME, TAGS_PAGE_TITLE } from 'lib/constants'
import { topicNames } from 'lib/topics'
import { getPostNumbersByTopics } from 'lib/api'

type Props = {
  topicNumberMap: Record<string, number>
}

const Tags = ({ topicNumberMap }: Props) => {
  return (
    <Layout>
      <article className="mb-8">
        <Head>
          <title>
            {TAGS_PAGE_TITLE} | {SITE_NAME}
          </title>
        </Head>
        <h1
          className={`
            max-w-2xl mx-auto mb-12
            text-2xl sm:text-4xl text-left font-bold tracking-wide break-all
          `}
        >{TAGS_PAGE_TITLE}</h1>
        <div className="max-w-2xl mx-auto flex flex-wrap gap-4">
          {Object.entries(topicNumberMap).map(([topic, number]: [string, number]) => (
            <TopicTip key={topic} topic={topic} number={number} />
          ))}
        </div>
      </article>
    </Layout>
  )
}

export default Tags

export async function getStaticProps() {
  const topicNumberMap = await getPostNumbersByTopics(topicNames)

  return {
    props: {
      topicNumberMap
    },
  }
}
