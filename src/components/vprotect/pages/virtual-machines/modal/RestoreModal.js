import React from 'react'
import {Modal, Icon} from 'patternfly-react'
import PropTypes from 'prop-types'
import {vprotectService} from '../../../services/vprotect-service'
import {Dropdown} from 'primereact/dropdown'
import {alertService} from '../../../services/alert-service'
import {BackupDropdown} from '../../../compoenents/input/BackupDropdown'
import {InputText} from 'primereact/inputtext'
import {Filesize} from '../../../compoenents/convert/Filezize'
import {ToggleButton} from 'primereact/togglebutton'
import {msg} from '../../../../../intl-messages'

export class RestoreModal extends React.Component {
  constructor (props) {
    super(props)

    this.getBackups()

    this.state = {
      backups: [],
      hypervisorManagers: [],
      storages: [],
      clusters: [],
      storage: null,
      cluster: {name: 'Other', guid: '', uuid: ''},
      specifyRestoredVirtualEnvironmentName: false,
      diskAllocationFormats: vprotectService.diskAllocationFormats,
      task: {
        backup: null,
        hypervisorManager: null,
        restoreStorageId: '',
        restoreClusterId: '',
        overwrite: false,
        restoredPeName: '',
        restoredDiskAllocationFormat: vprotectService.diskAllocationFormats[0]
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if ((!prevState.task.backup && this.state.task.backup) || (prevState.task.backup && prevState.task.backup.guid !== this.state.task.backup.guid)) {
      this.backupChange()
    }

    if ((!prevState.task.hypervisorManager && this.state.task.hypervisorManager) || (prevState.task.hypervisorManager && prevState.task.hypervisorManager.guid !== this.state.task.hypervisorManager.guid)) {
      this.getHypervisorStoragesForHypervisorManager(this.state.task.hypervisorManager.guid)
      this.getHypervisorClustersForHypervisorManager(this.state.task.hypervisorManager.guid)
    }

    if ((!prevState.storage && this.state.storage) || (prevState.storage && prevState.storage.uuid !== this.state.storage.uuid)) {
      this.passStorageToTask()
    }

    if ((!prevState.cluster && this.state.cluster) || (prevState.cluster && prevState.cluster.uuid !== this.state.cluster.uuid)) {
      this.passClusterToTask()
    }
  }

  passStorageToTask () {
    this.setState({task: {...this.state.task, restoreStorageId: this.state.storage.uuid}})
  }

  passClusterToTask () {
    this.setState({task: {...this.state.task, restoreClusterId: this.state.cluster.uuid}})
  }

  onSaveClick = () => {
    this.submitTask(this.state.task)
    this.props.closeModal()
  }

  submitTask (task) {
    vprotectService.submitTaskRestoreAndImport(task).then(
      () => {
        alertService.info(msg.vprotectRestoreTaskSuccess())
      }
    )
  }

  getBackups () {
    vprotectService.getRestorableBackups(this.props.virtualEnvironment.guid).then(
      (result) => {
        this.setState({task: {...this.state.task, backup: result[0]}, backups: result})
      }
    )
  }

  getHypervisorManagersAvailableForBackup () {
    vprotectService.getHypervisorManagersAvailableForBackup(this.state.task.backup.guid).then(
      (hypervisorManagers) => {
        if (hypervisorManagers.length > 0) {
          this.setState({hypervisorManagers: hypervisorManagers})
          if (this.props.virtualEnvironment.hvManager && this.isHypervisorInArray(this.props.virtualEnvironment.hvManager, hypervisorManagers)) {
            this.setState({task: {...this.state.task, hypervisorManager: this.findHypervisorInArray(this.props.virtualEnvironment.hvManager, hypervisorManagers)}})
          } else {
            this.setState({task: {...this.state.task, hypervisorManager: hypervisorManagers[0]}})
          }
          // TODO hvmRestoreAvailable
        }
      }
    )
  }

  isHypervisorInArray (hypervisor, hypervisors) {
    return !!hypervisors && hypervisors.length > -1 ? hypervisors.map(el => el.guid).indexOf(hypervisor.guid) > -1 : false
  }

  findHypervisorInArray (hypervisor, hypervisors) {
    return hypervisors.filter(el => el.guid === hypervisor.guid)[0]
  }

  getHypervisorStoragesForHypervisorManager (id) {
    vprotectService.getHypervisorStoragesForHvm(id).then(
      (storages) => {
        storages = [...storages, {name: 'Other', guid: '', uuid: ''}]
        this.setState({
          storages: storages,
          storage: storages[0]
        })
      }
    )
  }

  getHypervisorClustersForHypervisorManager (id) {
    vprotectService.getHypervisorClustersForHvm(id).then(
      (clusters) => {
        clusters = [...clusters, {name: 'Other', guid: '', uuid: ''}]
        this.setState({
          clusters: clusters,
          cluster: clusters[0]
        })
      }
    )
  }

  backupChange () {
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
          <Modal.Title>Restore</Modal.Title>
        </Modal.Header>
        <Modal.Body className='form'>
          <div>
            <label>Backup</label>
            <BackupDropdown value={this.state.task.backup}
                            onChange={(value) => {
                            this.setState({task: {...this.state.task, backup: value}})
                          }}
                            options={this.state.backups}
            />
          </div>
          <div>
            <div>
              <label>Hypervisor Manager</label>
              <Dropdown optionLabel='url'
                value={this.state.task.hypervisorManager}
                options={this.state.hypervisorManagers}
                onChange={(e) => this.setState({
                          task: {...this.state.task, hypervisorManager: e.value}
                        })}
              />
            </div>
          </div>
          <div>
            <label>Import to cluster</label>
            <Dropdown optionLabel='name'
              value={this.state.cluster}
              options={this.state.clusters}
              onChange={(e) => this.setState({
                         cluster: e.value
                      })}
            />
          </div>
          {this.state.cluster && this.state.cluster.name === 'Other' &&
          <div>
            <label>Enter Cluster ID</label>
            <InputText value={this.state.task.restoreClusterId}
              onChange={(e) => {
                         this.setState({
                           task: {
                             ...this.state.task,
                             restoreClusterId: e.target.value
                           }
                         })
                        }}
            />
          </div>}
          <div>
            <label>Import to storage</label>
            <Dropdown optionLabel='name'
              value={this.state.storage}
              options={this.state.storages}
              onChange={(e) => this.setState({
                        storage: e.value
                      })}
              itemTemplate={this.storageDropdownTemplate}
            />
          </div>
          {this.state.storage && this.state.storage.name === 'Other' &&
          <div>
            <label>Enter Storage ID</label>
            <InputText value={this.state.task.restoreStorageId}
              onChange={(e) => {
                         this.setState({
                           task: {
                             ...this.state.task,
                             restoreStorageId: e.target.value
                           }
                         })
                      }}
            />
          </div>}
          <div>
            <label>Delete if virtual environment already exists</label>
            <ToggleButton checked={this.state.task.overwrite}
              onChange={(e) => {
                            this.setState({
                              task: {
                                ...this.state.task,
                                overwrite: e.value
                              }
                            })
                        }}
            />
          </div>
          <div>
            <label>Specify name of the restored Virtual Environment</label>
            <ToggleButton checked={this.state.specifyRestoredVirtualEnvironmentName}
              onChange={(e) => {
                            this.setState({
                              specifyRestoredVirtualEnvironmentName: e.value
                            })
                        }}
            />
          </div>
          {this.state.specifyRestoredVirtualEnvironmentName &&
          <div>
            <label>Restored Virtual Environment name</label>
            <InputText value={this.state.task.restoredPeName}
              onChange={(e) => {
                         this.setState({
                           task: {
                             ...this.state.task,
                             restoredPeName: e.value
                           }
                         })
                      }}
            />
          </div>}
          <div>
            <label>Disk allocation format</label>
            <Dropdown optionLabel='name'
              value={this.state.task.restoredDiskAllocationFormat}
              options={this.state.diskAllocationFormats}
              onChange={(e) => this.setState({
                        task: {
                          ...this.state.task,
                          restoredDiskAllocationFormat: e.value
                        }
                      })}
            />
          </div>

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
