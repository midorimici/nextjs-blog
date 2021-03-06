import { ReactNode, FunctionComponent } from 'react'

type Props = {
  children?: ReactNode
}

const Container: FunctionComponent = ({ children }: Props) => {
  return <div className="container flex flex-col min-h-screen mx-auto px-5">
    {children}
  </div>
}

export default Container
