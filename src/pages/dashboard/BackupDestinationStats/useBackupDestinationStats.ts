import { useEffect, useState } from 'react';
import { vprotectService } from '@/services/vprotect-service';

export function useBackupDestinationStats() {
  const [backupDestinationStats, setBackupDestinationStats] = useState(null);

  useEffect(() => {
    void vprotectService
      .getDashboardBackupDestinationStats()
      .then(setBackupDestinationStats);
  }, []);

  return { backupDestinationStats };
}
