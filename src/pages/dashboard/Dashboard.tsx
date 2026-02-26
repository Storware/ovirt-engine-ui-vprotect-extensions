import { Chargeback } from './Chargeback/Chargeback';
import { ActivityChart } from './ActivityChart/ActivityChart';
import { InfoBar } from './InfoBar/InfoBar';
import { ProtectionStats } from './ProtectionStats/ProtectionStats';
import { BackupStats } from './BackupStats/BackupStats';
import { StagingSpace } from './StagingSpace/StagingSpace';
import { BackupDestinationStats } from './BackupDestinationStats/BackupDestinationStats';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDashboard } from './useDashboard';

export const Dashboard = () => {
  const { isNotOpenstackBuild } = useDashboard();

  return (
    <>
      <InfoBar />

      <div className="d-flex w-100">
        <ProtectionStats />

        <BackupStats />
      </div>

      {isNotOpenstackBuild && (
        <div className="d-flex align-items-stretch">
          <StagingSpace />

          <BackupDestinationStats />
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
