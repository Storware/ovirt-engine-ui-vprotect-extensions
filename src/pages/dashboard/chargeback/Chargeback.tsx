import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getChargebackData } from 'store/chargeback-chart/actions';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import ChargebackChart from 'components/chart/ChargebackChart';
import { selectRange } from 'store/reporting/selectors';

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

  return <ChargebackChart />;
};
