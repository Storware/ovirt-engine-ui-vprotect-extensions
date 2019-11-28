import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '../intl-messages'
import { formatNumber0D } from '../utils/intl'
import Tooltip from './bootstrap/Tooltip'

// PatternFly reference:
//  http://www.patternfly.org/pattern-library/cards/aggregate-status-card/

// TODO(vs) replace with
//  https://github.com/patternfly/patternfly-react/tree/master/packages/core/src/components/Cards/AggregateStatusCard

const AggregateStatusCard = ({
  data: { totalCount, statuses },
  title, mainIconClass, statusTypeToText, statusTypeToIconClass,
  noStatusText, noStatusIconClass, onTotalCountClick, onStatusCountClick
}) => {
  function getStatusItemTooltip (statusItem) {
    return `${statusTypeToText(statusItem.type)}: ${formatNumber0D(statusItem.count)}`
  }

  return (
    <div className='card-pf card-pf-aggregate-status card-pf-accented'>

      {/* header */}
      <h2 className='card-pf-title'>
        <a href='#' onClick={event => {
          event.preventDefault()
          onTotalCountClick()
        }}>
          <span className={mainIconClass} />
          <span className='card-pf-aggregate-status-count'>{formatNumber0D(totalCount)}</span>
          {' '}
          <span className='card-pf-aggregate-status-title'>{title}</span>
        </a>
      </h2>

      {/* status icons */}
      <div className='card-pf-body'>
        <p className='card-pf-aggregate-status-notifications'>

          {statuses.map(statusItem => (
            <span className='card-pf-aggregate-status-notification' key={statusItem.type}>
              <Tooltip text={getStatusItemTooltip(statusItem)}>
                <a href='#' onClick={event => {
                  event.preventDefault()
                  onStatusCountClick(statusItem)
                }}>
                  <span className={statusTypeToIconClass(statusItem.type)} />
                  {formatNumber0D(statusItem.count)}
                </a>
              </Tooltip>
            </span>
          ))}

          {statuses.length === 0 &&
            <span className='card-pf-aggregate-status-notification'>
              {noStatusIconClass && <span className={noStatusIconClass} />}
              {noStatusText}
            </span>
          }

        </p>
      </div>

    </div>
  )
}

const statusTypeInfo = {
  up: {
    text () { return msg.dashboardStatusTypeUp() },
    iconClass: 'fa fa-arrow-circle-o-up'
  },
  down: {
    text () { return msg.dashboardStatusTypeDown() },
    iconClass: 'fa fa-arrow-circle-o-down'
  },
  error: {
    text () { return msg.dashboardStatusTypeError() },
    iconClass: 'pficon pficon-error-circle-o'
  },
  warning: {
    text () { return msg.dashboardStatusTypeWarning() },
    iconClass: 'pficon pficon-warning-triangle-o'
  },
  alert: {
    text () { return msg.dashboardStatusTypeAlert() },
    iconClass: 'pficon pficon-flag'
  }
}

const dataShape = AggregateStatusCard.dataShape = {
  totalCount: PropTypes.number,
  statuses: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string, // should be unique within the array
    count: PropTypes.number
  }))
}

AggregateStatusCard.propTypes = {
  data: PropTypes.shape(dataShape).isRequired,
  title: PropTypes.string.isRequired,
  mainIconClass: PropTypes.string.isRequired,
  statusTypeToText: PropTypes.func,      // (statusType:string) => string
  statusTypeToIconClass: PropTypes.func, // (statusType:string) => string
  noStatusText: PropTypes.string,
  noStatusIconClass: PropTypes.string,
  onTotalCountClick: PropTypes.func,     // () => void
  onStatusCountClick: PropTypes.func     // (statusItem:object) => void
}

AggregateStatusCard.defaultProps = {
  statusTypeToText (statusType) {
    return statusTypeInfo[statusType] ? statusTypeInfo[statusType].text() : msg.dashboardStatusTypeUnknown()
  },
  statusTypeToIconClass (statusType) {
    return statusTypeInfo[statusType] ? statusTypeInfo[statusType].iconClass : 'fa fa-question'
  },
  noStatusText: '',
  noStatusIconClass: 'pficon pficon-ok',
  onTotalCountClick () {},
  onStatusCountClick () {}
}

export default AggregateStatusCard
