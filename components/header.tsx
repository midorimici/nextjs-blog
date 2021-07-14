import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faUser } from '@fortawesome/free-solid-svg-icons'

import BrandMi from './brand-mi';

const buttonStyle = "flex items-center gap-2 hover:text-pink-400 transition-colors duration-300"
const iconStyle = "w-6"

const Header = () => {
  return (
    <header className="py-8">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <BrandMi />
            <span className="font-bold text-5xl">
              どりみちのブログ
            </span>
          </a>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/tags">
            <a className={buttonStyle}>
              <FontAwesomeIcon icon={faTags} className={iconStyle} />
              Tags
            </a>
          </Link>
          <Link href="/about">
            <a className={buttonStyle}>
              <FontAwesomeIcon icon={faUser} className={iconStyle} />
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
