import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { colors } from './colors';
import dashboardService from 'services/dashboard-service';

export function useActivityChart() {
  const [chartData, setChartData] = useState(emptyChartData);

  useEffect(() => {
    const getChartData = async () => {
      const res = await dashboardService.getDashboardVmBackupSizeStats();
      emptyChartData.labels = [...Array(15)]
        .map((item, index) => index)
        .map((el) => moment().subtract(el, 'days').format('DD MMM'))
        .reverse();
      emptyChartData.datasets[0].data = Object.values(
        res.backupSizeStatsResponses,
      );
      emptyChartData.datasets[1].data = Object.values(
        res.restoreSizeStatsResponses,
      );
      setChartData({ ...emptyChartData });
    };

    void getChartData();
  }, []);

  return { chartData };
}

const emptyChartData = {
  labels: [],
  datasets: [
    { data: [], label: 'Backup', backgroundColor: colors[0].backgroundColor },
    { data: [], label: 'Restore', backgroundColor: colors[1].backgroundColor },
  ],
};
