import React from 'react'
import {Modal, Icon, Slider} from 'patternfly-react'
import PropTypes from 'prop-types'
import {VprotectService} from '../../services/vprotect-service'
import {Dropdown} from 'primereact/dropdown'
import {AlertService} from '../../services/alert-service'
import {DateDropdown} from './controls/DateDropdown'
import {InputText} from 'primereact/inputtext'
import {Filesize} from './convert/Filezize'

export class RestoreModal extends React.Component {
  vprotectService = new VprotectService()
  alertService = new AlertService()
  hypervisorsWithImportSupport = this.vprotectService.hypervisorsWithImportSupport

  constructor (props) {
    super(props)

    this.getBackups()

    this.state = {
      backups: [],
      restoreTo: this.vprotectService.restoreToOptions[0],
      restoreToOptions: this.vprotectService.restoreToOptions,
      nodes: [],
      importSupported: false,
      hypervisors: [],
      hypervisorManagers: [],
      storages: [],
      task: {
        backup: null,
        node: null,
        restorePath: '/vprotect_data',
        hypervisor: null,
        hypervisorManager: null,
        storage: null
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if ((!prevState.restoreTo && this.state.restoreTo) || (prevState.restoreTo && prevState.restoreTo.value !== this.state.restoreTo.value)) {

    }

    if ((!prevState.task.backup && this.state.task.backup) || (prevState.task.backup && prevState.task.backup.guid !== this.state.task.backup.guid)) {
      this.backupChange()
    }

    if ((!prevState.task.hypervisor && this.state.task.hypervisor) || (prevState.task.hypervisor && prevState.task.hypervisor.guid !== this.state.task.hypervisor.guid)) {
      this.getHypervisorStoragesForHypervisor(this.state.task.hypervisor.guid)
      this.isImportSupported(this.state.task.hypervisor.type)
    }

    // if (prevState.storages.length > 0 && prevState.storages[0].guid !== this.state.storages[0].guid) {
    //
    // }
  }

  onSaveClick = () => {
    switch (this.state.restoreTo.value) {
      case 'FS':
        this.restoreToFilesystem()
        break
      case 'HV':
        break
      case 'HVM':
        break
    }
    // this.submitTask(task);
    this.props.closeModal()
  }

  restoreToFilesystem() {
    this.vprotectService.submitTaskRestore(this.state.task).then(
      () => {
        this.alertService.info('alerts.restoreTaskHasBeenSubmitted');
      }
    );
  }

  getBackups () {
    this.vprotectService.getRestorableBackups(this.props.virtualEnvironment.guid).then(
      (result) => {
        if (result.length === 0) {
          this.alertService.error('sentences.thereAreNoRestorableBackupsForThisVe')
          this.props.closeModal()
          return
        }
        this.setState({task: {...this.state.task,backup: result[0]}, backups: result})
      }
    )
  }

  getNodes () {
    this.vprotectService.getAvailableNodesForBackup(this.state.task.backup.guid).then(
      result => {
        this.setState({task: {...this.state.task, node: result[0]}, nodes: result})
      }
    )
  }

  getHypervisorsAvailableForBackup () {
    this.vprotectService.getHypervisorsAvailableForBackup(this.state.task.backup.guid).then(
      (hypervisors) => {
        const hypervisorsWithType = hypervisors.map((el) => {
            return {name: el.host, guid: el.guid, type: this.props.virtualEnvironment.hvType}
        })

        this.setState({
          hypervisors: hypervisorsWithType
        })

        if (hypervisorsWithType.length > 0) {

          if (this.props.virtualEnvironment.hypervisor && this.isHypervisorInArray(this.props.virtualEnvironment.hypervisor, hypervisorsWithType)) {
            this.setState({task: {...this.state.task ,hypervisor: this.findHypervisorInArray(this.props.virtualEnvironment.hypervisor, hypervisorsWithType)}})
          } else {
            this.setState({task: {...this.state.task ,hypervisor: hypervisorsWithType[0]}})
          }

          //TODO hypervisorRestoreAvailable logic
        }
      }
    )
  }

  getHypervisorManagersAvailableForBackup() {
    this.vprotectService.getHypervisorManagersAvailableForBackup(this.state.task.backup.guid).then(
      (hypervisorManagers) => {

        // this.hvManagers = data.map(el => {
        //   return {...el, name: el.url};
        // });

        if (hypervisorManagers.length > 0) {
          if (this.props.virtualEnvironment.hvManager && this.isHypervisorInArray(this.props.virtualEnvironment.hvManager, hypervisorManagers)) {
            this.setState({task: {...this.state.task , hypervisorManager: this.findHypervisorInArray(this.props.virtualEnvironment.hvManager, hypervisorManagers)}})
          } else {
            this.setState({task: {...this.state.task , hypervisorManager: hypervisorManagers[0]}})
          }
          //TODO hvmRestoreAvailable
        }
      }
    );
  }

  isHypervisorInArray (hypervisor, hypervisors) {
    return !!hypervisors && hypervisors.length > -1 ? hypervisors.map(el => el.guid).indexOf(hypervisor.guid) > -1 : false
  }

  findHypervisorInArray (hypervisor, hypervisors) {
    return hypervisors.filter(el => el.guid === hypervisor.guid)[0]
  }

  isImportSupported (hypervisorType) {
    this.setState({importSupported: this.hypervisorsWithImportSupport.indexOf(hypervisorType.name) > -1})
  }

  getHypervisorStoragesForHypervisor (id) {
    this.vprotectService.getHypervisorStoragesForHv(id).then(
      (storages) => {
        storages = [...storages, {name: 'Other', guid: '', uuid: ''}]
        if (this.vprotectService.requiresHvStorage(this.state.task.backup, this.state.task.hypervisor)) {
          this.setState({
            storages: storages,
            task: {...this.state.task, storage: storages[0]}
          })
        }
      }
    )
  }

  backupChange () {
    this.getNodes()
    this.getHypervisorsAvailableForBackup()
    this.getHypervisorManagersAvailableForBackup()
  }

  storageDropdownTemplate (option) {
    return (
      <div>
        <span>{option.name}</span>
        {option.totalAvailableSpace &&
        <span>
          <Filesize bytes={option.totalAvailableSpace} />, free: <Filesize bytes={(option.totalAvailableSpace - option.totalUsedSpace)} />
        </span>}
      </div>
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
          <Modal.Title>Restore</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label>Backup</label>
            <DateDropdown value={this.state.task.backup}
                          onChange={(value) => {
                            this.setState({task: {...this.state.task, backup: value}})
                          }}
                          options={this.state.backups}
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
                        value={this.state.task.node}
                        options={this.state.nodes}
                        onChange={(event) => this.setState({
                          task: {...this.state.task, node: event.value}
                        })}
              />
            </div>
            <div>
              <label>Restore path</label>
              <InputText value={this.state.task.restorePath} onChange={(e) => {
                this.setState({
                  task: {...this.state.task, restorePath: e.value}
                })
              }}/>
            </div>
          </div>}

          {this.state.restoreTo.value === 'HV' &&
          <div>
            <div>
              <label>Hypervisor</label>
              <Dropdown optionLabel='name'
                        value={this.state.task.hypervisor}
                        options={this.state.hypervisors}
                        onChange={(event) => this.setState({
                          task: {...this.state.task , hypervisor: event.value}
                        })}
              />
            </div>
            <div>
              <label>Import to storage</label>
              <Dropdown optionLabel='name'
                        value={this.state.task.storage}
                        options={this.state.storages}
                        onChange={(event) => this.setState({
                          task: {...this.state.task, storage: event.value}
                        })}
                        itemTemplate={this.storageDropdownTemplate}
              />
            </div>

            {this.state.task.storage && this.state.task.storage.name === 'Other' &&
            <div>
              <label>{this.state.task.hypervisor.type.name === 'KVM' ? 'action.enterStorageIdRestPath' : 'action.enterStorageId'}</label>
              <InputText value={this.state.storage.uuid}
                         //TODO pattern for KVM
                         onChange={(e) => {
                          this.setState({
                            task: {
                              ...this.state.task,
                              storage: {
                                ...this.state.storage,
                                uuid: e.value
                              }
                            }
                          })}
                         }
              />
            </div>}

          </div>}

          {this.state.restoreTo.value === 'HVM' &&
          <div>
            <div>
              <label>Hypervisor Manager</label>
              <Dropdown optionLabel='url'
                        value={this.state.task.hypervisorManager}
                        options={this.state.hypervisorManagers}
                        onChange={(event) => this.setState({
                          task: {...this.state.task, hypervisorManager: event.value}
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
            this.onSaveClick()
          }}>
            Restore
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
