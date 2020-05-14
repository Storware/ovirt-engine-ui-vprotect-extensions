import React from 'react'
import {Modal, Icon, Slider} from 'patternfly-react'
import PropTypes from 'prop-types'
import {InputDate} from '../../compoenents/input/InputDate'

import {Dropdown} from 'primereact/dropdown'
import {vprotectService} from '../../services/vprotect-service'
import {backupDestinationsService} from '../../services/backup-destinations-service'
import {msg} from '../../../../intl-messages'
import {alertService} from '../../services/alert-service'

export class BackupModal extends React.Component {
  constructor (props) {
    super(props)

    this.getBackupDestinationsAndBackupTypes()

    this.state = {
      backupTypes: [],
      backupDestinations: [],
      task: {
        backupType: null,
        backupDestination: null,
        protectedEntities: null,
        priority: 50,
        windowStart: new Date().getTime()
      }
    }
  }

  getBackupDestinationsAndBackupTypes () {
    backupDestinationsService.getBackupDestinationsForVMs(this.props.virtualEnvironments).then(result => {
      const backupTypes = vprotectService.getBackupTypes(this.props.virtualEnvironments[0])
      this.setState({
        backupDestinations: result,
        backupTypes: backupTypes,
        task: {
          ...this.state.task,
          backupType: backupTypes[0],
          backupDestination: result[0]
        }
      })
    })
  }

  static getDerivedStateFromProps (props, state) {
    return {
      task: {
        ...state.task,
        protectedEntities: props.virtualEnvironments
      }
    }
  }

  setPriority = (value) => {
    this.setState({task: {...this.state.task, priority: JSON.parse(value)}})
  }

  submitTask = (task) => {
    vprotectService.submitExportTask(task).then(() => {
      alertService.info(msg.vprotectBackupTaskSuccess())
    })
  }

  onSaveClick = (task) => {
    this.submitTask(task)
    this.props.closeModal()
  }

  render () {
    return (
      <Modal show onHide={this.close}>
        <Modal.Header>
          <button
            className='close'
            aria-hidden='true'
            aria-label='Close'
            onClick={this.props.closeModal}
          >
            <Icon type='pf' name='close' />
          </button>
          <Modal.Title>Backup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Backup type</label>
            <Dropdown optionLabel='name'
              value={this.state.task.backupType}
              options={this.state.backupTypes}
              onChange={(event) => this.setState({
                        task: {
                          ...this.state.task,
                          backupType: event.value
                        }
                      })}
            />

            <label>Backup destination</label>
            <Dropdown optionLabel='name'
              value={this.state.task.backupDestination}
              options={this.state.backupDestinations}
              onChange={(event) => this.setState({
                        task: {
                          ...this.state.task,
                          backupDestination: event.value
                        }
                      })}
            />
          </div>
          <div>
            <label>Priority</label>
            <Slider
              id='slider-one'
              showBoundaries
              value={this.state.task.priority}
              tooltip='show'
              input
              onSlide={this.setPriority}
            />
          </div>
          <div>
            <label>Window start</label>
            <InputDate value={this.state.task.windowStart}
              onChange={(e) => this.setState({task: {...this.state.task, windowStart: e}})} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.props.closeModal}>
            Cancel
          </button>
          <button onClick={() => {
            this.onSaveClick(this.state.task)
          }}>
            Backup
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

BackupModal.propTypes = {
  virtualEnvironments: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired
}
