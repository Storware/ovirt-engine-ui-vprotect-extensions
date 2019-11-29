import React from 'react'
import {Modal, Icon, Slider} from 'patternfly-react'
import PropTypes from 'prop-types'
import {Calendar} from 'primereact/calendar'
import {Dropdown} from 'primereact/dropdown'
import {VprotectService} from '../../services/vprotect-service'
import getPluginApi from '../../plugin-api'
import {webadminToastTypes} from '../../constants'
import {msg} from '../../intl-messages'

export class BackupModal extends React.Component {
  vprotectService = new VprotectService()

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
        windowStart: new Date()
      }
    }
  }

  getBackupDestinationsAndBackupTypes () {
    this.vprotectService.getBackupDestinationsForVMs([this.props.virtualEnvironment]).then(result => {
      const backupTypes = this.vprotectService.getBackupTypes(this.props.virtualEnvironment)
      this.setState({
        backupDestinations: result,
        backupTypes: backupTypes,
        task: {
          ...this.state.task,
          backupType: backupTypes[0],
          backupDestination: result[0],
        }
      })
    })
  }

  static getDerivedStateFromProps (props, state) {
    return {
      task: {
        ...state.task,
        protectedEntities: [props.virtualEnvironment]
      }
    }
  }

  setPriority = (value) => {
    this.setState({task: {...this.state.task, priority: JSON.parse(value)}})
  }

  submitTask = (task) => {
    this.vprotectService.submitExportTask(task).then(() => {
      getPluginApi().showToast(webadminToastTypes.info, msg.vprotectBackupTaskSuccess())
    })
  }

  onSaveClick = (task) => {
    this.submitTask(task)
    this.props.closeModal()
  }

  render () {
    return (
      <Modal show={true} onHide={this.close}>
        <Modal.Header>
          <button
            className='close'
            aria-hidden='true'
            aria-label='Close'
            onClick={this.props.closeModal}
          >
            <Icon type='pf' name='close'/>
          </button>
          <Modal.Title>Backup</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Backup type</label>
            <Dropdown optionLabel="name"
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
            <Dropdown optionLabel="name"
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
            <Calendar showTime={true} hourFormat="24" value={this.state.task.windowStart}
                      onChange={(e) => this.setState({task: {...this.state.task, windowStart: e.value}})}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.props.closeModal}>
            Cancel
          </button>
          <button onClick={() => {
            let taskWithConvertedDate = {...this.state.task, windowStart: Date.parse(this.state.task.windowStart)}
            this.onSaveClick(taskWithConvertedDate)
          }}>
            Backup
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

BackupModal.propTypes = {
  virtualEnvironment: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired
}
