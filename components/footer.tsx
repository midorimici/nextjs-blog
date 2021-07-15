import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  return (
    <footer>
      <div className="py-8 flex justify-center items-center gap-2">
        {`© 2020–${(new Date()).getFullYear()}`}
        <FontAwesomeIcon icon={faStar} className="w-5 inline-block animate-rotate" />
        みどりみちのブログ
      </div>
    </footer>
  )
}

export default Footer
