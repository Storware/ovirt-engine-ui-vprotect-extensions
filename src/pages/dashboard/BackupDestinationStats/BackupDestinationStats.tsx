import { BackupDestinationStatsUI } from './BackupDestinationStatsUI';
import { useBackupDestinationStats } from './useBackupDestinationStats';

export function BackupDestinationStats() {
  const { backupDestinationStats } = useBackupDestinationStats();

  return (
    <BackupDestinationStatsUI backupDestinationStats={backupDestinationStats} />
  );
}
