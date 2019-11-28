import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '../intl-messages'
import { formatDateTime } from '../utils/intl'

const LastUpdatedLabel = ({ date }) => {
  return (
    <span>
      <span className='fa fa-clock-o' /> <b>{msg.dashboardLastUpdated()}</b> {formatDateTime(date)}
    </span>
  )
}

LastUpdatedLabel.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
}

export default LastUpdatedLabel
