import { ChartSection } from '../ChartSection/ChartSection';
import { protectionBackgroundColors } from '../ChartSection/branding-config';
import { useProtectionStats } from './useProtectionStats';

export function ProtectionStats() {
  const { protection, sumChartData } = useProtectionStats();

  return (
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
      title={sumChartData}
      subTitle={'VMs'}
    />
  );
}
