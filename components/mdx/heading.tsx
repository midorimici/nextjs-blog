import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'

type Props = { type: 2 | 3, content: string }

const Heading = ({ type, content }: Props) => {
  const HeadingComponent: React.ElementType = `h${type}`
  const link = content
    .replace(/[:\/?#\[\]@!$&'()*+,;=]/g, '')
    .replace(/ /g, '-')
    .toLowerCase()

  return (
    <HeadingComponent id={link}>
      <Link href={`#${link}`}>
        <a className="heading-link relative">
          {content}
          <FontAwesomeIcon
            icon={faLink}
            className={`
              heading-icon absolute -left-10 bottom-0
              text-yellow-500 opacity-0 transition-opacity duration-300
            `}
          />
        </a>
      </Link>
    </HeadingComponent>
  )
}

export default Heading