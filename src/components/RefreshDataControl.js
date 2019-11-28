import React from 'react'
import PropTypes from 'prop-types'
import { msg } from '../intl-messages'
import Tooltip from './bootstrap/Tooltip'

// TODO(vs) utilize
//  https://github.com/patternfly/patternfly-react/tree/master/packages/core/src/components/Tooltip
//  https://github.com/patternfly/patternfly-react/tree/master/packages/core/src/components/OverlayTrigger

const RefreshDataControl = ({ onRefresh }) => {
  return (
    <Tooltip text={msg.dashboardRefreshButtonTooltip()} placement='bottom' hideOnClick>
      <div className='btn-group'>
        <button type='button' className='btn btn-default' onClick={event => {
          event.preventDefault()
          onRefresh()
        }}>
          <i className='fa fa-refresh' />
        </button>
        {/* refresh configuration drop down menu would go here */}
      </div>
    </Tooltip>
  )
}

RefreshDataControl.propTypes = {
  onRefresh: PropTypes.func.isRequired
}

export default RefreshDataControl
