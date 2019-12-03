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
      backup: null,
      backups: [],
      restoreTo: this.vprotectService.restoreToOptions[0],
      restoreToOptions: this.vprotectService.restoreToOptions,
      node: null,
      nodes: [],
      restorePath: '/vprotect_data',
      hypervisor: null,
      importSupported: false,
      hypervisors: [],
      storage: null,
      storages: [],
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
    if ((!prevState.restoreTo && this.state.restoreTo) || (prevState.restoreTo && prevState.restoreTo.value !== this.state.restoreTo.value)) {
      this.restoreToChange(this.state.restoreTo)
    }

    if ((!prevState.backup && this.state.backup) || (prevState.backup && prevState.backup.guid !== this.state.backup.guid)) {
      this.backupChange()
    }

    if ((!prevState.hypervisor && this.state.hypervisor) || (prevState.hypervisor && prevState.hypervisor.guid !== this.state.hypervisor.guid)) {
      this.getHypervisorStoragesForHypervisor(this.state.hypervisor.guid)
      this.isImportSupported(this.state.hypervisor.type)
    }

    // if (prevState.storages.length > 0 && prevState.storages[0].guid !== this.state.storages[0].guid) {
    //
    // }

  }

  onSaveClick = (task) => {
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
        this.setState({backup: result[0], backups: result})
        this.selectDefaultRestoreToOption()
      }
    )
  }

  getNodes () {
    this.vprotectService.getAvailableNodesForBackup(this.state.backup.guid).then(
      result => {
        this.setState({node: result[0], nodes: result})
      }
    )
  }

  getHypervisorsAvailableForBackup () {
    this.vprotectService.getHypervisorsAvailableForBackup(this.state.backup.guid).then(
      (hypervisors) => {
        const hypervisorsWithType = hypervisors.map((el) => {
            return {name: el.host, guid: el.guid, type: this.props.virtualEnvironment.hvType}
        })

        this.setState({
          hypervisors: hypervisorsWithType
        })

        if (hypervisorsWithType.length > 0) {

          if (this.props.virtualEnvironment.hypervisor && this.isHypervisorInArray(this.props.virtualEnvironment.hypervisor, hypervisorsWithType)) {
            this.setState({hypervisor: this.findHypervisorInArray(this.props.virtualEnvironment.hypervisor, hypervisorsWithType)})
          } else {
            this.setState({hypervisor: hypervisorsWithType[0]})
          }

          // this.hypervisorRestoreAvailable = true;
          // this.radioRestore = 'HV';
          // this.onRadioChange('HV');
        }
        // else {
        //   this.hypervisorRestoreAvailable = false;
        // }
      }
    )

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
        if (this.vprotectService.requiresHvStorage(this.state.backup, this.state.hypervisor)) {
          this.setState({
            storages: storages,
            storage: storages[0]
          })
        }
      }
    )
  }

  restoreToChange (restoreTo) {
    switch (restoreTo.value) {
      case 'FS':
        // this.getNodes()
        break
      case 'HV':
        break
      case 'HVM':
        break
    }

  }

  backupChange () {
    this.getNodes()
    this.getHypervisorsAvailableForBackup()
  }

  selectDefaultRestoreToOption () {
    this.restoreToChange(this.state.restoreTo)
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
            <DateDropdown value={this.state.backup}
                          onChange={(value) => {
                            this.setState({backup: value})
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
                        value={this.state.node}
                        options={this.state.nodes}
                        onChange={(event) => this.setState({
                          node: event.value
                        })}
              />
            </div>
            <div>
              <label>Restore path</label>
              <InputText value={this.state.restorePath} onChange={(e) => {
                this.setState({restorePath: e.value})
              }}/>
            </div>
          </div>}

          {this.state.restoreTo.value === 'HV' &&
          <div>
            <div>
              <label>Hypervisor</label>
              <Dropdown optionLabel='name'
                        value={this.state.hypervisor}
                        options={this.state.hypervisors}
                        onChange={(event) => this.setState({
                          hypervisor: event.value
                        })}
              />
            </div>
            <div>
              <label>Import to storage</label>
              <Dropdown optionLabel='name'
                        value={this.state.storage}
                        options={this.state.storages}
                        onChange={(event) => this.setState({
                          storage: event.value
                        })}
                        itemTemplate={this.storageDropdownTemplate}
              />
            </div>

            {this.state.storage && this.state.storage.name === 'Other' &&
            <div>
              <label>{this.state.hypervisor.type.name === 'KVM' ? 'action.enterStorageIdRestPath' : 'action.enterStorageId'}</label>
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

          </div>}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.props.closeModal}>
            Cancel
          </button>
          <button onClick={() => {
            this.onSaveClick(this.state.task)
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
