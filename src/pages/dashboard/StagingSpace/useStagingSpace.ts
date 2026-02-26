import { useEffect, useState } from 'react';
import { vprotectService } from '@/services/vprotect-service';

export function useStagingSpace() {
  const [stagingSpace, setStagingSpace] = useState([]);

  useEffect(() => {
    void vprotectService.getDashboardStagingSpaceInfo().then((result) => {
      setStagingSpace(result);
    });
  }, []);

  return { stagingSpace };
}
