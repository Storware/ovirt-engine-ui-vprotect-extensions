import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChargebackData } from 'store/chargeback-chart/actions';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import ChargebackChart from 'components/chart/ChargebackChart';
import { selectRange } from 'store/reporting/selectors';
import { Card } from 'primereact/card';

export default () => {
  const dispatch = useDispatch();
  const range = useSelector(selectRange);
  useEffect(() => {
    dispatch(
      getChargebackData(range, {
        groupBy: 'virtual-machine',
        // ...(config.build === 'OPENSTACK' && { projectGuids: [getCookie('project')] }),
      } as ChargebackRequest),
    );
  }, []);

  return (
    <Card className="w-100 ml-2 mt-3">
      <div className={'card-pf-heading'}>
        <h5 className={'font-weight-light'}>Last 24h backup size</h5>
      </div>
      <hr />
      <div className="d-flex w-100">
        <ChargebackChart />
      </div>
    </Card>
  );
};
