import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import {
  commonSizeOptions,
  commonTimeOptions,
  tickSizeOptions,
  tickTimeOptions,
} from 'pages/dashboard/chargeback/commonSizeOptions';

const prepareChart = {
  size: (data, state) => {
    return {
      ...state,
      options: {
        maintainAspectRatio: false,
        ...commonSizeOptions('y'),
        scales: {
          y: tickSizeOptions(data.datasets[0]?.data),
        },
      },
    };
  },
  time: (data, state) => {
    return {
      ...state,
      options: {
        maintainAspectRatio: false,
        ...commonTimeOptions('y'),
        scales: {
          y: tickTimeOptions(data.datasets[0]?.data),
        },
      },
    };
  },
};

export default ({ data, chartType }) => {
  const [state, setState] = useState({
    options: {},
  });

  useEffect(() => {
    setState({
      ...prepareChart[chartType](data, state),
    });
  }, [data, chartType]);

  return (
    <div>
      <Chart
        type="bar"
        style={{ height: '360px' }}
        data={data}
        options={state.options}
      />
    </div>
  );
};
