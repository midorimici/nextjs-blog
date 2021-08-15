import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'

import { useImagePlaceholder } from 'components/useImagePlaceholder'

export type RelatedPostProps = {
  link: string
  relatedPosts: Record<string, string>
}

const RelatedPost = ({ link, relatedPosts }: RelatedPostProps) => {
  const postTitle = relatedPosts[link]
  const imgPath = `/posts/${link}/_index.jpg`
  const placeholder = useImagePlaceholder(320, 180)
  
  return (
    <section className={`
      relative flex flex-col sm:flex-row items-end sm:items-start gap-4
      p-4 my-4
      rounded-2xl
      cursor-pointer
      transition duration-300
      shadow hover:shadow-lg hover:bg-white
      hover:opacity-80
    `}>
      <Link as={`/posts/${link}`} href="/posts/[slug]">
        <a
          className="absolute top-0 left-0 w-full h-full z-10"
          aria-label={`関連記事:${postTitle}`}
        ></a>
      </Link>
      <section className="flex-grow flex flex-col gap-4 w-full">
        <span className="pb-2 font-bold text-2xl text-pink-400 border-b-2 border-pink-400">
          <FontAwesomeIcon icon={faBookOpen} width={28} />&nbsp;
          関連記事
        </span>
        <span dangerouslySetInnerHTML={{ __html : postTitle }} />
      </section>
      <section className="flex-shrink-0 flex">
        <Image
          src={imgPath}
          alt={postTitle}
          width={320}
          height={180}
          className="rounded-b-2xl sm:rounded-l-none sm:rounded-r-2xl"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${placeholder}`}
        />
      </section>
    </section>
  )
}

export default RelatedPost
