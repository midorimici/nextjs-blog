import Link from 'next/link'

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
            <a>Tags</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </nav>
      </div>
      <div className="bg-yellowgreen h-2 mt-4"></div>
    </header>
  )
}

export default Header
