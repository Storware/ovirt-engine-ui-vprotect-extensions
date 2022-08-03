import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DateShow } from '../../../components/convert/Date';
import { Filesize } from '../../../components/convert/Filesize';
import { BackupModal } from 'components/modal/BackupModal/BackupModal';
import { TabView, TabPanel } from 'primereact/tabview';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBackups,
  selectBackupsHistory,
  selectDisks,
  selectHypervisor,
  selectRestoresHistory,
  selectSchedules,
  selectSnapshots,
  selectSnapshotsHistory,
  selectVirtualMachine,
} from 'store/virtual-machine/selectors';
import {
  getVirtualMachinePage,
  getVirtualMachineTabs,
} from 'store/virtual-machine/actions';
import { showModalAction } from 'store/modal/actions';
import { createBrowserHistory } from 'history';
import BarChartContainer from 'components/chart/BarChartContainer';
import { RestoreModal } from 'pages/virtual-machines/modal/RestoreModal';
import { DateType } from 'model/time/calendarPropsModel';
import { DateRangeModel } from 'model/time/dateRange.model';
import { Calendar } from 'primereact/calendar';
import {
  BackupsHistoryTable,
  BackupsTable,
  DisksTable,
  RestoresHistoryTable,
  SchedulesTable,
  Settings,
  SnapshotsHistoryTable,
  SnapshotsTable,
} from 'pages/virtual-machines/virtual-machine/tabs';

const VirtualMachine = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date();
  lastDay.setHours(23);
  lastDay.setMinutes(59);

  const [dateRange, setDateRange] = useState<DateType>([firstDay, lastDay]);
  const [dateRangeWithTime, setDateRangeWithTime] = useState<[Date, Date]>([
    firstDay,
    lastDay,
  ]);
  const notInitialRender = useRef(false);
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { guid } = useParams();
  const history = createBrowserHistory();

  const backups = useSelector(selectBackups);
  const backupsHistory = useSelector(selectBackupsHistory);
  const restoresHistory = useSelector(selectRestoresHistory);
  const snapshots = useSelector(selectSnapshots);
  const snapshotsHistory = useSelector(selectSnapshotsHistory);
  const disks = useSelector(selectDisks);
  const schedules = useSelector(selectSchedules);

  const virtualMachine = useSelector(selectVirtualMachine);
  const hypervisor = useSelector(selectHypervisor);

  const convertDateRangeToObjectNumber = ([_from, _to]: [
    Date,
    Date,
  ]): DateRangeModel => ({
    from: _from.getTime(),
    to: _to.getTime(),
  });

  const loadPage = () =>
    dispatch(
      getVirtualMachinePage(
        guid,
        convertDateRangeToObjectNumber(dateRangeWithTime),
      ),
    );
  const loadTabs = () =>
    dispatch(
      getVirtualMachineTabs(
        guid,
        hypervisor,
        convertDateRangeToObjectNumber(dateRangeWithTime),
      ),
    );

  useEffect(() => {
    loadPage();
  }, [dispatch]);

  useEffect(() => {
    const from = dateRange[0];
    const to = new Date(dateRange[1] || from);
    to.setHours(23);
    to.setMinutes(59);
    setDateRangeWithTime([from, to]);
  }, [dateRange]);

  useEffect(() => {
    if (notInitialRender.current) {
      loadTabs();

      return;
    }

    notInitialRender.current = true;
  }, [dateRangeWithTime]);

  const Details = ({ title, children, ...rest }) => {
    if (!children) {
      return <></>;
    }
    return (
      <div {...rest} className="mb-3">
        <h5>{title}</h5>
        <div>{children}</div>
      </div>
    );
  };

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
          <Button className="ml-2" label="Refresh" onClick={loadPage} />
        </div>
      </div>
      <Card
        title={virtualMachine.name}
        subTitle={virtualMachine.uuid}
        className="mt-4"
      >
        <div className={'row'}>
          <div className={'col'}>
            <Details title="BACKUP DETAILS">
              <p>
                Last backup:{' '}
                <b>
                  <DateShow date={virtualMachine.lastBackup} />
                </b>
              </p>
              <p>
                Last backup size:{' '}
                <b>
                  <Filesize bytes={virtualMachine.lastSuccessfulBackupSize} />
                </b>
              </p>
              <p>
                Last full backup size:{' '}
                <b>
                  <Filesize
                    bytes={virtualMachine.lastSuccessfulFullBackupSize}
                  />
                </b>
              </p>
            </Details>
          </div>

          <div className={'col'}>
            <Details title="HYPERVISOR TAGS">
              {virtualMachine.tags?.length > 0 &&
                virtualMachine.tags.map((el, index, arr) => (
                  <span>
                    {el}
                    {index === arr.length - 1 ? '' : ', '}
                  </span>
                ))}
            </Details>

            <Details title="NODE">{hypervisor?.node?.name}</Details>
            <Details title="Backup Policy">
              {virtualMachine?.vmBackupPolicy?.name}
            </Details>
            <Details title="Snapshot Management Policy">
              {virtualMachine?.snapshotMgmtPolicy?.name}
            </Details>
          </div>

          <div className={'col'}>
            <Details title="HYPERVISOR MANAGER">
              {virtualMachine.hvManager?.url}
            </Details>
            <Details title="HYPERVISOR">{hypervisor.host}</Details>
          </div>
        </div>
      </Card>

      <div className="d-flex flex-column flex-md-row mt-4">
        <Card className="flex-fill mr-md-2" title="Backup/Restore Statistics">
          <BarChartContainer
            datasets={{
              backupsHistory,
              restoresHistory,
            }}
            dateRange={dateRangeWithTime}
          />
        </Card>
        <Card className="mt-4 mt-md-0 ml-md-2" title="Events Calendar">
          <Calendar
            id="range"
            value={dateRange}
            onChange={({ value }) => setDateRange(value)}
            selectionMode="range"
            maxDate={new Date()}
            inline
          />
        </Card>
      </div>

      <Card className="mt-4">
        <TabView>
          <TabPanel header={`Backup (${backups.length})`}>
            <BackupsTable
              date={dateRange}
              setDate={setDateRange}
              onRefresh={() => loadPage()}
            />
          </TabPanel>
          <TabPanel header={`Backup History (${backupsHistory.length})`}>
            <BackupsHistoryTable
              date={dateRange}
              setDate={setDateRange}
              onRefresh={() => loadPage()}
            />
          </TabPanel>
          <TabPanel header={`Restore History (${restoresHistory.length})`}>
            <RestoresHistoryTable date={dateRange} setDate={setDateRange} />
          </TabPanel>
          <TabPanel header={`Snapshots (${snapshots.length})`}>
            <SnapshotsTable />
          </TabPanel>
          <TabPanel header={`Snapshots History (${snapshotsHistory.length})`}>
            <SnapshotsHistoryTable />
          </TabPanel>
          <TabPanel header={`Disks (${disks.length})`}>
            <DisksTable />
          </TabPanel>
          <TabPanel header={`Schedules (${schedules.length})`}>
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
