import React from 'react'
import {Modal, Icon, Slider} from 'patternfly-react'
import PropTypes from 'prop-types'
import {VprotectService} from '../../services/vprotect-service'
import {Dropdown} from 'primereact/dropdown'
import {AlertService} from '../../services/alert-service'

export class RestoreModal extends React.Component {
  vprotectService = new VprotectService()
  alertService = new AlertService();

  constructor (props) {
    super(props)

    this.getBackups()

    this.state = {
      backup: null,
      backups: [],
      restoreTo: this.vprotectService.restoreToOptions[0],
      restoreToOptions: this.vprotectService.restoreToOptions,
      node: null,
      nodes: [],
      task: {}
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      task: {
        ...state.task,
        protectedEntities: props.virtualEnvironments
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    console.log('componentDidUpdate')
    console.log(prevState)
    console.log(this.state)
    if (prevState.restoreTo.value !== this.state.restoreTo.value) {
      this.restoreToChange(this.state.restoreTo)
    }
  }

  onSaveClick = (task) => {
    // this.submitTask(task);
    this.props.closeModal()
  }

  getBackups () {
    this.vprotectService.getRestorableBackups(this.props.virtualEnvironment.guid).then(
      (result) => {
        console.log(result)
        if (result.length === 0) {
          this.alertService.error('sentences.thereAreNoRestorableBackupsForThisVe')
          this.props.closeModal()
          console.log('closeClickOnBackupMethod')
        } else {
          this.setState({backup: result[0], backups: result})
          // this.selectBackup(this.backups[0].guid);
        }
      }
    )
  }

  getNodes () {
    this.vprotectService.getAvailableNodesForBackup(this.state.backup.guid).then(
      result => {
        this.setState({node: result[0],nodes: result})
      }
    )
  }

  restoreToChange (restoreTo) {
    if (restoreTo.value === 'FS') {
      this.getNodes();
    }
  }

  static dateTemplateDropdown (option) {
    return (
      <span>{new Date(option.snapshotTime).toLocaleString()}</span>
    )
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
            <label>Backup</label>
            <Dropdown optionLabel='snapshotTime'
                      value={this.state.backup}
                      options={this.state.backups}
                      onChange={(event) => this.setState({
                        backup: event.value
                      })}
                      itemTemplate={RestoreModal.dateTemplateDropdown}
            />
          </div>
          <div>
            <label>Restore to</label>
            <Dropdown optionLabel='label'
                      value={this.state.restoreTo}
                      options={this.state.restoreToOptions}
                      onChange={(event) => this.setState({
                        restoreTo: event.value
                      })}
            />
          </div>
          {this.state.restoreTo.value === 'FS' &&
          <div>
            <div>
              <label>Node</label>
              <Dropdown optionLabel='name'
                        value={this.state.node}
                        options={this.state.nodes}
                        onChange={(event) => this.setState({
                          node: event.value
                        })}
              />
            </div>

          </div>}

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

RestoreModal.propTypes = {
  virtualEnvironment: PropTypes.any.isRequired,
  closeModal: PropTypes.func.isRequired
}
