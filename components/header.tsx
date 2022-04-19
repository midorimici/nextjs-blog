import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faUser } from '@fortawesome/free-solid-svg-icons'

const buttonStyle = 'flex items-center gap-2 hover:text-pink-400 transition-colors duration-300'
const iconStyle = 'w-6'

/* eslint-disable @next/next/no-img-element */
const Header = () => {
  return (
    <header className="py-8">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <img
              src="/favicon/safari-pinned-tab.svg"
              alt="mi"
              width={32}
              height={32}
              className="w-8 sm:w-12 fill-current dark:invert"
            />
            <span className="font-bold sm:text-5xl">どりみちのブログ</span>
          </a>
        </Link>
        <nav className="flex items-center gap-6 sm:gap-8">
          <Link href="/tags">
            <a className={buttonStyle} aria-label="Tags">
              <FontAwesomeIcon icon={faTags} className={iconStyle} />
              <span className="hidden sm:block">Tags</span>
            </a>
          </Link>
          <Link href="/about">
            <a className={buttonStyle} aria-label="About">
              <FontAwesomeIcon icon={faUser} className={iconStyle} />
              <span className="hidden sm:block">About</span>
            </a>
          </Link>
        </nav>
      </div>
      <div className="bg-pink-300 rounded h-2 mt-4"></div>
    </header>
  )
}

export default Header
