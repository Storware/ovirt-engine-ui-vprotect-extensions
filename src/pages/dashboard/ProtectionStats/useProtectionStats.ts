import { useEffect, useState } from 'react';
import { DashboardProtectionInfoModel } from '@/model/dashboard/dashboard-protection-info.model';
import { vprotectService } from '@/services/vprotect-service';

export function useProtectionStats() {
  const [protection, setProtection] = useState<DashboardProtectionInfoModel>();

  useEffect(() => {
    void vprotectService.getDashboardProtectionInfo().then(setProtection);
  }, []);

  return {
    protection,
    sumChartData:
      protection &&
      `${getSumChartData([
        protection.vm.protectedNo,
        protection.vm.notProtected,
        protection.vm.noSchedule,
      ])}`,
  };
}

const getSumChartData = (arr: number[]) =>
  arr.reduce((prev, acc) => prev + acc, 0);
