import { ReportSizeContainer } from 'pages/reporting/components/ReportSizeContainer';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectBackupSizeChartData } from 'store/chargeback-chart/selectors';
import { getChargebackBackupSizeData } from 'store/chargeback-chart/actions';

export default () => {
  const chartData = useSelector(selectBackupSizeChartData);

  return (
    <ReportSizeContainer
      chartData={chartData}
      getChargebackData={getChargebackBackupSizeData}
    />
  );
};
