import PropTypes from 'prop-types'
import * as moment from 'moment-timezone'
import {timezone} from '../../services/time'

export const DateShow = ({date}) => {
  return date ? moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss') : ''
}

DateShow.propTypes = {
  date: PropTypes.number
}
