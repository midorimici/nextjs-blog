import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false)

  window.onscroll = () => setShowButton(scrollY > 600 ? true : false)

  return (
    <div className={`
      fixed right-0 ${showButton ? 'bottom-0' : '-bottom-16'} z-50
      tansition-all duration-300
    `}>
      <a href="#" aria-label="トップに戻る" className="block p-4">
        <FontAwesomeIcon icon={faArrowUp} width={20} />
      </a>
    </div>
  )
}

export default BackToTopButton
