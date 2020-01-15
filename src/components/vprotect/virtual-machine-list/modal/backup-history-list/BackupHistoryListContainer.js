import React from 'react'
import {BackupHistoryList} from './BackupHistoryList'
import PropTypes from 'prop-types'
import {Icon, Modal} from 'patternfly-react'

export class BackupHistoryListContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    }
  }

  render () {
    return (
      <Modal show onHide={this.close} className={'width-850px'}>
        <Modal.Header>
          <button
            className='close'
            aria-hidden='true'
            aria-label='Close'
            onClick={this.props.closeModal}
          >
            <Icon type='pf' name='close' />
          </button>
          <Modal.Title>Backup history</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BackupHistoryList user={this.state.user} virtualEnvironmentGuid={this.props.virtualEnvironment.guid} />
        </Modal.Body>
      </Modal>
    )
  }
}

BackupHistoryListContainer.propTypes = {
  virtualEnvironment: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired
}
