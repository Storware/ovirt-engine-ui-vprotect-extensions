import { useEffect, useState } from 'react';
import { DashboardBackupStatsModel } from '@/model/dashboard/dashboard-backup-stats.model';
import { vprotectService } from '@/services/vprotect-service';

export function useBackupStats() {
  const [backupStats, setBackupStats] = useState<DashboardBackupStatsModel>();

  useEffect(() => {
    void vprotectService.getDashboardBackupStats().then(setBackupStats);
  }, []);

  return {
    backupStats,
    sumChartData:
      backupStats &&
      `${getSumChartData([
        backupStats.successful,
        backupStats.failed,
        backupStats.inProgress,
      ])}`,
  };
}

const getSumChartData = (arr: number[]) =>
  arr.reduce((prev, acc) => prev + acc, 0);
