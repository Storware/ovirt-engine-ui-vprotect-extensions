import React from 'react';
import { ReportSizeContainer } from 'pages/reporting/components/ReportSizeContainer';
import { useSelector } from 'react-redux';
import { selectTransferSizeChartData } from 'store/chargeback-chart/selectors';
import { getChargebackTransferSizeData } from 'store/chargeback-chart/actions';

export default () => {
  const chartData = useSelector(selectTransferSizeChartData);

  return (
    <ReportSizeContainer
      chartData={chartData}
      getChargebackData={getChargebackTransferSizeData}
    />
  );
};
