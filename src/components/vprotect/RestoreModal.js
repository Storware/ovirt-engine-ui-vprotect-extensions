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

  constructor (props) {
    super(props)

    this.getBackups()

    this.state = {
      backups: [],
      hypervisorManagers: [],
      storages: [],
      clusters: [],
      storage: null,
      cluster: null,
      task: {
        backup: null,
        hypervisorManager: null,
        restoreStorageId: null,
        restoreClusterId: null
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
      this.setState({task: {...this.state.task, restoreStorageId: this.state.storage.uuid}})
    }

    if ((!prevState.cluster && this.state.cluster) || (prevState.cluster && prevState.cluster.uuid !== this.state.cluster.uuid)) {
      this.setState({task: {...this.state.task, restoreClusterId: this.state.cluster.uuid}})
    }
  }

  onSaveClick = () => {

    // this.submitTask(task);
    this.props.closeModal()
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

  getHypervisorManagersAvailableForBackup() {
    this.vprotectService.getHypervisorManagersAvailableForBackup(this.state.task.backup.guid).then(
      (hypervisorManagers) => {
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

  getHypervisorStoragesForHypervisorManager (id) {
    this.vprotectService.getHypervisorStoragesForHvm(id).then(
      (storages) => {
        storages = [...storages, {name: 'Other', guid: '', uuid: ''}]
        this.setState({
          storages: storages,
          storage: storages[0],
        })
      }
    )
  }

  getHypervisorClustersForHypervisorManager(id) {
    this.vprotectService.getHypervisorClustersForHvm(id).then(
      (clusters) => {
        clusters = [...clusters, {name: 'Other', guid: '', uuid: ''}]
        this.setState({
          clusters: clusters,
          cluster: clusters[0]
        })
      }
    );
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
          </div>
          <div>
            <label>Import to cluster</label>
            <Dropdown optionLabel='name'
                      value={this.state.task.cluster}
                      options={this.state.clusters}
                      onChange={(event) => this.setState({
                         cluster: event.value
                      })}
            />
          </div>
          {this.state.task.storage && this.state.task.storage.name === 'Other' &&
          <div>
            <label>Enter Cluster ID</label>
            <InputText value={this.state.cluster.uuid}
                       onChange={(e) => {
                         this.setState({
                           cluster: {
                             uuid: e.value
                           }
                         })}
                       }
            />
          </div>}
          <div>
            <label>Import to storage</label>
            <Dropdown optionLabel='name'
                      value={this.state.task.storage}
                      options={this.state.storages}
                      onChange={(event) => this.setState({
                        storage: event.value
                      })}
                      itemTemplate={this.storageDropdownTemplate}
            />
          </div>
          {this.state.task.storage && this.state.task.storage.name === 'Other' &&
          <div>
            <label>Enter Storage ID</label>
            <InputText value={this.state.storage.uuid}
                       onChange={(e) => {
                         this.setState({
                           storage: {
                             uuid: e.value
                           }
                         })}
                       }
            />
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
