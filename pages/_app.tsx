import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppProps } from 'next/app'

import { existsGaId, pageview } from 'lib/gtag'
import 'styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (!existsGaId) { return }

    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  
  return <Component {...pageProps} />
}
