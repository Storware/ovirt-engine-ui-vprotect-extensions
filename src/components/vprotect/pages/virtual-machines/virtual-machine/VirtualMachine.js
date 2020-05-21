import React from 'react'
import {
  Link,
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'
import {virtualMachinesService} from '../../../services/virtual-machines.service'
import {backupsService} from '../../../services/backups.service'
import {Panel} from 'primereact/panel'
import {Card} from 'primereact/card'
import {Button} from 'primereact/button'
import {DateShow} from '../../../compoenents/convert/Date'
import {VirtualMachineModel} from '../../../model/VirtualMachineModel'
import {Filesize} from '../../../compoenents/convert/Filezize'
import {hypervisorsService} from '../../../services/hypervisors-service'
import {BackupModal} from '../../../compoenents/modal/BackupModal'
import {RestoreModal} from '../modal/RestoreModal'
import BarChartContainer from '../../../compoenents/chart/BarChartContainer'
import {TabView, TabPanel} from 'primereact/tabview'
import BackupsTable from './BackupTable'
import BackupHistoryTable from './BackupsHistoryTable'

class VirtualMachine extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      virtualMachine: new VirtualMachineModel(),
      backupsHistory: [],
      restoresHistory: []
    }

    this.getData()
  }

  async getData () {
    const virtualMachine = await virtualMachinesService.getVirtualMachine(this.props.match.params.guid)
    const hypervisor = await hypervisorsService.getHypervisor(virtualMachine.hypervisor.guid)
    const backupsHistory = await backupsService.getProtectedEntityBackups(this.props.match.params.guid)
    const restoresHistory = await backupsService.getProtectedEntityRestoreJobs(this.props.match.params.guid)

    this.setState({
      ...this.state,
      virtualMachine: virtualMachine,
      hypervisor: hypervisor,
      backupsHistory: backupsHistory,
      restoresHistory: restoresHistory
    })
  }

  render () {
    return (
      <Panel header='Virtual Machine'>
        <div className='d-flex justify-content-between mt-3'>
          <div>
            <Link to={`/virtual-machines`}>
              <Button label='Back' />
            </Link>
          </div>
          <div>
            <Button className='mx-2' label='Backup' onClick={() => {
              this.setState({
                ...this.state,
                showBackupModal: true
              })
            }} />
            {this.state.virtualMachine.lastSuccessfulBackupSize > 0 && <Button className='mx-2' label='Restore' onClick={() => {
              this.setState({
                ...this.state,
                showRestoreModal: true
              })
            }} />}
            <Button className='ml-2' label='Refresh' onClick={this.getData} />
          </div>
        </div>
        <Card title={this.state.virtualMachine.name}
          subTitle={this.state.virtualMachine.uuid}
          className='mt-4'>
          <div className={'row'}>
            <div className={'col'}>
              <h3>BACKUP DETAILS</h3>
              <p>Last backup - <DateShow date={this.state.virtualMachine.lastBackup} /></p>
              <p>Last backup size - <Filesize bytes={this.state.virtualMachine.lastBackup} /></p>
              <p>Last full backup size- <Filesize bytes={this.state.virtualMachine.lastSuccessfulFullBackupSize} /></p>
            </div>

            <div className={'col'}>
              {this.state.virtualMachine.tags && <div>
                <h3>HYPERVISOR TAGS</h3>
                {this.state.virtualMachine.tags.map((el, index, arr) => {
                  return (
                    <span>{el}{index === arr.length - 1 ? '' : ', '}</span>
                  )
                })}
              </div>}
              {this.state.hypervisor && this.state.hypervisor.node && <div>
                <h3>NODE</h3>
                <span>
                  {this.state.hypervisor.node.name}
                </span>
              </div>}
              {this.state.virtualMachine.vmBackupPolicy && <div>
                <h3>Backup Policy</h3>
                <span>
                  {this.state.virtualMachine.vmBackupPolicy.name}
                </span>
              </div>}
              {this.state.virtualMachine.snapshotMgmtPolicy && <div>
                <h3>Snapshot Management Policy</h3>
                <span>
                  {this.state.virtualMachine.snapshotMgmtPolicy.name}
                </span>
              </div>}
            </div>

            <div className={'col'}>
              {this.state.virtualMachine.hvManager && <div>
                <h3>HYPERVISOR MANAGER</h3>
                <span>
                  {this.state.virtualMachine.hvManager.name}
                </span>
              </div>}
              {this.state.hypervisor && <div>
                <h3>HYPERVISOR</h3>
                <span>
                  {this.state.hypervisor.name}
                </span>
              </div>}
            </div>
          </div>
        </Card>

        <Card className='mt-4' title='Backup/Restore Statistics'>
          <BarChartContainer datasets={{
            backupsHistory: this.state.backupsHistory,
            restoresHistory: this.state.restoresHistory
          }} />
        </Card>

        <Card className='mt-4' title='Backup/Restore Statistics'>
          <TabView>
            <TabPanel header='Backup'>
              <BackupsTable />
            </TabPanel>
            <TabPanel header='Backup History'>
              <BackupHistoryTable />
            </TabPanel>
            <TabPanel header='Restore History'>
              Content III
            </TabPanel>
            <TabPanel header='Snapshots'>
              Content III
            </TabPanel>
            <TabPanel header='Disks'>
              Content III
            </TabPanel>
            <TabPanel header='Schedules'>
              Content III
            </TabPanel>
            <TabPanel header='Settings'>
              Content III
            </TabPanel>
          </TabView>
        </Card>

        {this.state.showBackupModal &&
        <BackupModal closeModal={() => {
          this.setState({
            ...this.state,
            showBackupModal: false
          })
        }}
          virtualEnvironments={[this.state.virtualMachine]} />
        }

        {this.state.showRestoreModal &&
        <RestoreModal closeModal={() => {
          this.setState({
            ...this.state,
            showRestoreModal: false
          })
        }}
          virtualEnvironment={this.state.virtualMachine} />
        }
      </Panel>
    )
  }
}

VirtualMachine.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(VirtualMachine)
