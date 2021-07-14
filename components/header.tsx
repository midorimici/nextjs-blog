import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faUser } from '@fortawesome/free-solid-svg-icons'

const Header = () => {
  return (
    <header className="py-8">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a>
            <span className="font-bold text-5xl">
              みどりみちのブログ
            </span>
          </a>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/tags">
            <a className='hover:text-pink-400 transition-colors duration-300'>
              <FontAwesomeIcon icon={faTags} />
              &nbsp;
              Tags
            </a>
          </Link>
          <Link href="/about">
            <a className='hover:text-pink-400 transition-colors duration-300'>
              <FontAwesomeIcon icon={faUser} />
              &nbsp;
              About
            </a>
          </Link>
        </nav>
      </div>
      <div className="bg-yellowgreen rounded h-2 mt-4"></div>
    </header>
  )
}

export default Header
