import { parseISO, format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'

type Props = {
  dateString: string
  type: 'date' | 'lastmod'
}

const DateFormatter = ({ dateString, type }: Props) => {
  const date = parseISO(dateString)
  return (
    <time dateTime={dateString} className="mx-2 inline-flex items-center gap-2">
      <FontAwesomeIcon
        icon={type === 'date' ? faCalendarAlt : faCalendarCheck}
        className="w-4"
      />
      {format(date, 'yyyy.MM.dd')}
    </time>
  )
}

export default DateFormatter
