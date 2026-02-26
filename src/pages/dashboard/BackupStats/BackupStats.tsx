import { ChartSection } from '../ChartSection/ChartSection';
import { protectionBackgroundColors } from '../ChartSection/branding-config';
import { useBackupStats } from './useBackupStats';

export function BackupStats() {
  const { backupStats, sumChartData } = useBackupStats();

  return (
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
      title={sumChartData}
      additionalText={`Total data protected: ${backupStats?.totalData}`}
    />
  );
}
