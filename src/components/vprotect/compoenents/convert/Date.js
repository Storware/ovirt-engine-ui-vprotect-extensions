import PropTypes from 'prop-types'
import * as moment from 'moment-timezone'

export const DateShow = ({date, timezone}) => {
  return date ? moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss') : ''
}

DateShow.propTypes = {
  date: PropTypes.number,
  timezone: PropTypes.string.isRequired
}
