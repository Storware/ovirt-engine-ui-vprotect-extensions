import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DateShow } from '../../../components/convert/Date';
import { Filesize } from '../../../components/convert/Filesize';
import { BackupModal } from '../../../components/modal/BackupModal/BackupModal';
import { TabView, TabPanel } from 'primereact/tabview';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBackupsHistory,
  selectHypervisor,
  selectRestoresHistory,
  selectVirtualMachine,
} from '../../../store/virtual-machine/selectors';
import { getVirtualMachinePage } from '../../../store/virtual-machine/actions';
import BackupsHistoryTable from './BackupsHistoryTable';
import BackupsTable from './BackupsTable';
import RestoresHistoryTable from './RestoresHistoryTable';
import SnapshotsTable from './SnapshotsTable';
import SnapshotsHistoryTable from './SnapshotsHistoryTable';
import DisksTable from './DisksTable';
import SchedulesTable from './SchedulesTable';
import Settings from './components/Settings';
import { showModalAction } from '../../../store/modal/actions';
import { createBrowserHistory } from 'history';
import BarChartContainer from 'components/chart/BarChartContainer';
import { RestoreModal } from 'pages/virtual-machines/modal/RestoreModal';

const VirtualMachine = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();
  const history = createBrowserHistory();

  useEffect(() => {
    dispatch(getVirtualMachinePage(guid));
  }, [dispatch]);

  const virtualMachine = useSelector(selectVirtualMachine);
  const backupsHistory = useSelector(selectBackupsHistory);
  const restoresHistory = useSelector(selectRestoresHistory);
  const hypervisor = useSelector(selectHypervisor);

  return (
    <Panel header="Virtual Machine">
      <div className="d-flex justify-content-between mt-3">
        <div>
          <Button label="Back" onClick={history.back} />
        </div>
        <div>
          <Button
            className="mx-2"
            label="Backup"
            onClick={() => {
              dispatch(
                showModalAction({
                  component: BackupModal,
                  props: {
                    virtualEnvironments: [virtualMachine],
                  },
                  title: 'Backup',
                }),
              );
            }}
          />
          {virtualMachine.lastSuccessfulBackupSize > 0 && (
            <Button
              className="mx-2"
              label="Restore"
              onClick={() => {
                dispatch(
                  showModalAction({
                    component: RestoreModal,
                    props: {
                      virtualEnvironment: virtualMachine,
                    },
                    title: 'Restore',
                  }),
                );
              }}
            />
          )}
          <Button className="ml-2" label="Refresh" onClick={this.getData} />
        </div>
      </div>
      <Card
        title={virtualMachine.name}
        subTitle={virtualMachine.uuid}
        className="mt-4"
      >
        <div className={'row'}>
          <div className={'col'}>
            <h5>BACKUP DETAILS</h5>
            <p>
              Last backup - <DateShow date={virtualMachine.lastBackup} />
            </p>
            <p>
              Last backup size -{' '}
              <Filesize bytes={virtualMachine.lastSuccessfulBackupSize} />
            </p>
            <p>
              Last full backup size -{' '}
              <Filesize bytes={virtualMachine.lastSuccessfulFullBackupSize} />
            </p>
          </div>

          <div className={'col'}>
            {virtualMachine.tags && (
              <div>
                <h5>HYPERVISOR TAGS</h5>
                {virtualMachine.tags.map((el, index, arr) => {
                  return (
                    <span>
                      {el}
                      {index === arr.length - 1 ? '' : ', '}
                    </span>
                  );
                })}
              </div>
            )}
            {hypervisor && hypervisor.node && (
              <div>
                <h5>NODE</h5>
                <span>{hypervisor.node.name}</span>
              </div>
            )}
            {virtualMachine.vmBackupPolicy && (
              <div>
                <h5>Backup Policy</h5>
                <span>{virtualMachine.vmBackupPolicy.name}</span>
              </div>
            )}
            {virtualMachine.snapshotMgmtPolicy && (
              <div>
                <h5>Snapshot Management Policy</h5>
                <span>{virtualMachine.snapshotMgmtPolicy.name}</span>
              </div>
            )}
          </div>

          <div className={'col'}>
            {virtualMachine.hvManager && (
              <div>
                <h5>HYPERVISOR MANAGER</h5>
                <span>{virtualMachine.hvManager.name}</span>
              </div>
            )}
            {hypervisor && (
              <div>
                <h5>HYPERVISOR</h5>
                <span>{hypervisor.name}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="mt-4" title="Backup/Restore Statistics">
        <BarChartContainer
          datasets={{
            backupsHistory,
            restoresHistory,
          }}
        />
      </Card>

      <Card className="mt-4" title="Backup/Restore Statistics">
        <TabView>
          <TabPanel header="Backup">
            <BackupsTable />
          </TabPanel>
          <TabPanel header="Backup History">
            <BackupsHistoryTable />
          </TabPanel>
          <TabPanel header="Restore History">
            <RestoresHistoryTable />
          </TabPanel>
          <TabPanel header="Snapshots">
            <SnapshotsTable />
          </TabPanel>
          <TabPanel header="Snapshots History">
            <SnapshotsHistoryTable />
          </TabPanel>
          <TabPanel header="Disks">
            <DisksTable />
          </TabPanel>
          <TabPanel header="Schedules">
            <SchedulesTable />
          </TabPanel>
          <TabPanel header="Settings">
            <Settings />
          </TabPanel>
        </TabView>
      </Card>
    </Panel>
  );
};

export default VirtualMachine;
