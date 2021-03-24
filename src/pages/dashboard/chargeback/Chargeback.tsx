import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getChargebackData } from 'store/chargeback-chart/actions';
import { ChargebackRequest } from 'model/chargeback/vm-chargeback-request';
import ChargebackChart from 'components/chart/ChargebackChart';

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getChargebackData({
        groupBy: 'virtual-machine',
        // ...(config.build === 'OPENSTACK' && { projectGuids: [getCookie('project')] }),
      } as ChargebackRequest),
    );
  }, []);

  return <ChargebackChart />;
};
