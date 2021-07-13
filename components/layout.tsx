import Container from './container'
import Header from './header'
import Footer from './footer'
import Meta from './meta'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen bg-yellow-50 text-xl">
        <Container>
          <Header />
          <main>{children}</main>
          <Footer />
        </Container>
      </div>
    </>
  )
}

export default Layout
