import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { getChargebackBackupSizeData } from 'store/chargeback-chart/actions';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import ChargebackChart from 'components/chart/ChargebackChart';
import { selectRange } from 'store/reporting/selectors';
import { selectBackupSizeChartData } from 'store/chargeback-chart/selectors';

export function Chargeback() {
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

  return (
    <Card className="w-100 h-100 mt-3">
      <div className={'card-pf-heading'}>
        <h5 className={'font-weight-light'}>Current Backup Size</h5>
      </div>
      <hr />
      <ChargebackChart chartData={chartData} />
    </Card>
  );
}
