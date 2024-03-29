import { useEffect, useState } from 'react';
import { vprotectService } from '../../services/vprotect-service';
import { hypervisorsService } from '../../services/hypervisors-service';
import { ChartDonut } from '@patternfly/react-charts';
import { Toolbar } from '@patternfly/react-core';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import Chargeback from './chargeback/Chargeback';
import ActivityChart from './activity/ActivityChart';
import { Card } from 'primereact/card';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Button } from 'primereact/button';
import { TIMEZONE_UTC, TIMEZONES } from 'model/time/timezones';
import { version } from '../../../package.json';
import { DashboardProtectionInfoModel } from 'model/dashboard/dashboard-protection-info.model';
import { DashboardBackupStatsModel } from 'model/dashboard/dashboard-backup-stats.model';
import { BackupDestinationStatsComponent } from 'pages/dashboard/backup-destination/BackupDestinationStats';
import { StagingSpace } from 'pages/dashboard/staging-space/StagingSpace';
import { ChartSection } from 'pages/dashboard/ChartSection/ChartSection';
import { protectionBackgroundColors } from './ChartSection/branding-config';
import getCookie from 'utils/getCookie';

const cookieTimezone = getCookie('django_timezone');

const fullTimeZoneName =
  TIMEZONES.find(({ utc }) =>
    utc.some((utc_) => cookieTimezone?.replace(/['"]+/g, '') === utc_),
  )?.text || TIMEZONE_UTC.text;

export const Dashboard = () => {
  const [protection, setProtection] = useState<DashboardProtectionInfoModel>();
  const [backupStats, setBackupStats] = useState<DashboardBackupStatsModel>();
  const [stagingSpace, setStaginngSpace] = useState([]);
  const [backupDestinationStats, setBackupDestinationStats] = useState(null);

  useEffect(() => {
    void vprotectService.getDashboardProtectionInfo().then(setProtection);
    void vprotectService.getDashboardBackupStats().then(setBackupStats);
    void vprotectService.getDashboardStagingSpaceInfo().then((result) => {
      setStaginngSpace(result);
    });
    if (isNotOpenstackBuild) {
      void vprotectService
        .getDashboardBackupDestinationStats()
        .then(setBackupDestinationStats);
    }
  }, []);

  const getSumChartData = (arr: number[]) =>
    arr.reduce((prev, acc) => prev + acc, 0);

  const synchronizeInventory = () => {
    void hypervisorsService
      .getAllHypervisorManagers()
      .then((hypervisorManagers) => {
        void vprotectService.submitTaskSync({
          hypervisorManagers: hypervisorManagers
            .filter((el) => el.type.name === 'RHV')
            .map((el) => ({ guid: el.guid })),
        });
      });
  };

  return (
    <>
      <Toolbar>
        <div className={'d-flex flex-row justify-content-between'}>
          <div>Timezone: {fullTimeZoneName}</div>
          <div>Plugin version: {version}</div>
          {isNotOpenstackBuild && (
            <div className={'form-group'}>
              <Button
                label="Synchronize inventory"
                onClick={synchronizeInventory}
              />
            </div>
          )}
        </div>
      </Toolbar>
      <div className="d-flex w-100">
        <ChartSection
          header={'Protection stats'}
          chartHeader={'VIRTUAL MACHINES'}
          data={
            protection && [
              {
                x: 'Protected',
                y: protection.vm.protectedNo,
              },
              {
                x: 'Not Protected',
                y: protection.vm.notProtected,
              },
              {
                x: 'Not Scheduled',
                y: protection.vm.noSchedule,
              },
            ]
          }
          colorScale={protectionBackgroundColors}
          title={
            protection &&
            `${getSumChartData([
              protection.vm.protectedNo,
              protection.vm.notProtected,
              protection.vm.noSchedule,
            ])}`
          }
          subTitle={'VMs'}
        />
        <ChartSection
          header={'Success Rate'}
          chartHeader={'VIRTUAL MACHINES'}
          data={
            backupStats && [
              {
                x: 'Success',
                y: backupStats.successful,
              },
              {
                x: 'Failed',
                y: backupStats.failed,
              },
              {
                x: 'In progress',
                y: backupStats.inProgress,
              },
            ]
          }
          colorScale={protectionBackgroundColors}
          subTitle={'tasks'}
          title={
            backupStats &&
            `${getSumChartData([
              backupStats.successful,
              backupStats.failed,
              backupStats.inProgress,
            ])}`
          }
          additionalText={`Total data protected: ${backupStats?.totalData}`}
        />
      </div>

      {isNotOpenstackBuild && (
        <div className="d-flex align-items-stretch">
          <Card className="w-100 mr-3 mt-3">
            <div>
              <div className={'card-pf-heading'}>
                <h5 className={'font-weight-light'}>Staging Space</h5>
              </div>
              <hr />
              <div>
                <StagingSpace stagingSpace={stagingSpace} />
              </div>
            </div>
          </Card>
          <Card className="w-100 mt-3">
            <div>
              <div className={'card-pf-heading'}>
                <h5 className={'font-weight-light'}>Backup Destinations</h5>
              </div>
              <hr />
              <div>
                <BackupDestinationStatsComponent
                  backupDestinationStats={backupDestinationStats}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="d-flex w-100">
        <div className="w-50 ml-2 flex-grow-1">
          <Chargeback />
        </div>
        <div className="w-50 ml-2 flex-grow-1">
          <ActivityChart />
        </div>
      </div>
    </>
  );
};
