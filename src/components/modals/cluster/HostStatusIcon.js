import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'patternfly-react'

/* eslint-disable key-spacing, no-multi-spaces */
const statusMap = {
  // 'connecting'               : { type: '', name: '', tooltip: '' },
  'down'                     : { type: 'fa', name: 'arrow-circle-o-down', class: 'host-status-icon-red', tooltip: 'Down' },
  // 'error'                    : { type: '', name: '', tooltip: '' },
  // 'initializing'             : { type: '', name: '', tooltip: '' },
  // 'install_failed'           : { type: '', name: '', tooltip: '' },
  // 'installing'               : { type: '', name: '', tooltip: '' },
  // 'installing_os'            : { type: '', name: '', tooltip: '' },
  // 'kdumping'                 : { type: '', name: '', tooltip: '' },
  // 'maintenance'              : { type: '', name: '', tooltip: '' },
  // 'non_operational'          : { type: '', name: '', tooltip: '' },
  // 'non_responsive'           : { type: '', name: '', tooltip: '' },
  // 'pending_approval'         : { type: '', name: '', tooltip: '' },
  // 'preparing_for_maintenance': { type: '', name: '', tooltip: '' },
  // 'reboot'                   : { type: '', name: '', tooltip: '' },
  // 'unassigned'               : { type: '', name: '', tooltip: '' },
  'up'                       : { type: 'fa', name: 'arrow-circle-o-up', class: 'host-status-icon-green', tooltip: 'Up' },
  'DEFAULT'                  : { type: 'pf', name: 'unknown' }
}

/**
 * Render a Host's status as an Icon
 */
const HostStatusIcon = ({ status }) => {
  const entry = statusMap[status] || statusMap['DEFAULT']
  const tooltip = entry.tooltip || status

  return <Icon
    type={entry.type}
    name={entry.name}
    title={tooltip}
    className={`host-status-icon ${entry.class || ''}`}
  />
}

HostStatusIcon.propTypes = {
  status: PropTypes.string
}

export default HostStatusIcon
