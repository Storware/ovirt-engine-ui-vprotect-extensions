import { colors } from 'pages/dashboard/chargeback/colors';

export default (sortedChartData, page) => {
  const startIndex = page * 10;
  const labels = sortedChartData.labels.slice(startIndex, startIndex + 10);
  const data = sortedChartData.datasets[0].data.slice(
    startIndex,
    startIndex + 10,
  );

  return {
    labels,
    datasets: [
      {
        label: 'Size',
        data,
        backgroundColor: colors[0].backgroundColor,
      },
    ],
  };
};
