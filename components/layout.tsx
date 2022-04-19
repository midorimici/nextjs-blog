import dynamic from 'next/dynamic'

import Container from './container'
import Header from './header'
import Meta from './meta'

const Footer = dynamic(() => import('./footer'))

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen bg-yellow-50 dark:bg-slate-600">
        <Container>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Container>
      </div>
    </>
  )
}

export default Layout
