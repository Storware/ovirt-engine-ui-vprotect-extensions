import React, {useEffect, useState} from 'react'
import {
    Link,
    useParams
} from 'react-router-dom'
import {Panel} from 'primereact/panel'
import {Card} from 'primereact/card'
import {Button} from 'primereact/button'
import {DateShow} from '../../../compoenents/convert/Date'
import {Filesize} from '../../../compoenents/convert/Filezize'
import {BackupModal} from '../../../compoenents/modal/BackupModal'
import {RestoreModal} from '../modal/RestoreModal'
import BarChartContainer from '../../../compoenents/chart/BarChartContainer'
import {TabView, TabPanel} from 'primereact/tabview'
import {useDispatch, useSelector} from 'react-redux'
import {
    selectBackupsHistory,
    selectHypervisor,
    selectRestoresHistory,
    selectVirtualMachine,
} from '../../../../../store/virtual-machine/selectors'
import {getVirtualMachinePage} from '../../../../../store/virtual-machine/actions';
import BackupsHistoryTable from './BackupsHistoryTable';
import BackupsTable from './BackupsTable';
import RestoresHistoryTable from './RestoresHistoryTable';
import SnapshotsTable from './SnapshotsTable';
import DisksTable from './DisksTable';
import SchedulesTable from './SchedulesTable';
import Settings from './Settings';

const VirtualMachine = () => {
    let dispatch = useDispatch();
    let {guid} = useParams();

    let showBackupModal;
    let setShowBackupModal;
    [showBackupModal, setShowBackupModal] = useState(false);
    let showRestoreModal;
    let setShowRestoreModal;
    [showRestoreModal, setShowRestoreModal] = useState(false);

    useEffect(() => {
        dispatch(getVirtualMachinePage(guid));
    }, [dispatch]);

    let virtualMachine = useSelector(selectVirtualMachine)
    let backupsHistory = useSelector(selectBackupsHistory)
    let restoresHistory = useSelector(selectRestoresHistory)
    let hypervisor = useSelector(selectHypervisor)

    return (
        <Panel header='Virtual Machine'>
            <div className='d-flex justify-content-between mt-3'>
                <div>
                    <Link to={`/virtual-machines`}>
                        <Button label='Back'/>
                    </Link>
                </div>
                <div>
                    <Button className='mx-2' label='Backup' onClick={() => {
                        setShowBackupModal(true)
                    }}/>
                    {virtualMachine.lastSuccessfulBackupSize > 0 &&
                    <Button className='mx-2' label='Restore' onClick={() => {
                        setShowRestoreModal(true)
                    }}/>}
                    <Button className='ml-2' label='Refresh' onClick={this.getData}/>
                </div>
            </div>
            <Card title={virtualMachine.name}
                  subTitle={virtualMachine.uuid}
                  className='mt-4'>
                <div className={'row'}>
                    <div className={'col'}>
                        <h3>BACKUP DETAILS</h3>
                        <p>Last backup - <DateShow date={virtualMachine.lastBackup}/></p>
                        <p>Last backup size - <Filesize bytes={virtualMachine.lastBackup}/></p>
                        <p>Last full backup size- <Filesize bytes={virtualMachine.lastSuccessfulFullBackupSize}/></p>
                    </div>

                    <div className={'col'}>
                        {virtualMachine.tags && <div>
                          <h3>HYPERVISOR TAGS</h3>
                            {virtualMachine.tags.map((el, index, arr) => {
                                return (
                                    <span>{el}{index === arr.length - 1 ? '' : ', '}</span>
                                )
                            })}
                        </div>}
                        {hypervisor && hypervisor.node && <div>
                          <h3>NODE</h3>
                          <span>
                  {hypervisor.node.name}
                </span>
                        </div>}
                        {virtualMachine.vmBackupPolicy && <div>
                          <h3>Backup Policy</h3>
                          <span>
                  {virtualMachine.vmBackupPolicy.name}
                </span>
                        </div>}
                        {virtualMachine.snapshotMgmtPolicy && <div>
                          <h3>Snapshot Management Policy</h3>
                          <span>
                  {virtualMachine.snapshotMgmtPolicy.name}
                </span>
                        </div>}
                    </div>

                    <div className={'col'}>
                        {virtualMachine.hvManager && <div>
                          <h3>HYPERVISOR MANAGER</h3>
                          <span>
                  {virtualMachine.hvManager.name}
                </span>
                        </div>}
                        {hypervisor && <div>
                          <h3>HYPERVISOR</h3>
                          <span>
                  {hypervisor.name}
                </span>
                        </div>}
                    </div>
                </div>
            </Card>

            <Card className='mt-4' title='Backup/Restore Statistics'>
                <BarChartContainer datasets={{
                    backupsHistory: backupsHistory,
                    restoresHistory: restoresHistory
                }}/>
            </Card>

            <Card className='mt-4' title='Backup/Restore Statistics'>
                <TabView>
                    <TabPanel header='Backup'>
                        <BackupsTable/>
                    </TabPanel>
                    <TabPanel header='Backup History'>
                        <BackupsHistoryTable />
                    </TabPanel>
                    <TabPanel header='Restore History'>
                        <RestoresHistoryTable/>
                    </TabPanel>
                    <TabPanel header='Snapshots'>
                        <SnapshotsTable />
                    </TabPanel>
                    <TabPanel header='Disks'>
                        <DisksTable />
                    </TabPanel>
                    <TabPanel header='Schedules'>
                        <SchedulesTable />
                    </TabPanel>
                    <TabPanel header='Settings'>
                        <Settings />
                    </TabPanel>
                </TabView>
            </Card>

            {showBackupModal &&
            <BackupModal closeModal={() => {
                setShowBackupModal(false)
            }}
                         virtualEnvironments={[virtualMachine]}/>
            }

            {showRestoreModal &&
            <RestoreModal closeModal={() => {
                setShowRestoreModal(false)
            }}
                          virtualEnvironment={virtualMachine}/>
            }
        </Panel>
    )
}

export default VirtualMachine
