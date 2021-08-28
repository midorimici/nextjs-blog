import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

type Props = {
  date: string
  type: 'date' | 'lastmod'
}

const DateFormatter = ({ date, type }: Props) => {
  return (
    <time dateTime={date} className="mx-2 inline-flex items-center gap-2 text-base sm:text-lg">
      <FontAwesomeIcon
        icon={type === 'date' ? faCalendarAlt : faCalendarCheck}
        className="w-4"
        aria-label={type === 'date' ? '公開日' : '更新日'}
      />
      {date}
    </time>
  )
}

export default DateFormatter
