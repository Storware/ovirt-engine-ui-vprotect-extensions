import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChargebackBackupSizeData } from 'store/chargeback-chart/actions';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import ChargebackChart from 'components/chart/ChargebackChart';
import { selectRange } from 'store/reporting/selectors';
import { selectBackupSizeChartData } from 'store/chargeback-chart/selectors';

export default () => {
  const dispatch = useDispatch();
  const range = useSelector(selectRange);
  const chartData = useSelector(selectBackupSizeChartData);

  useEffect(() => {
    dispatch(
      getChargebackBackupSizeData(range, {
        groupBy: 'virtual-machine',
        // ...(config.build === 'OPENSTACK' && { projectGuids: [getCookie('project')] }),
      } as ChargebackRequest),
    );
  }, []);

  return <ChargebackChart chartData={chartData} />;
};
