import { Doughnut } from 'react-chartjs-2';
import React from 'react';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 80,
  legend: {
    display: false,
  },
};

const backgroundColor = ['#0f9d58', '#38689E', '#c70015'];

export default ({ report, type }) => {
  const label = {
    backups: 'Protected',
    restores: 'Restored',
  };

  const dataset = {
    label: `Data ${label[type]}: ${report[type].totalData}`,
    data: [
      report[type].successful,
      report[type].inProgress,
      report[type].failed,
    ],
    total: report[type].total,
    backgroundColor,
    borderWidth: 1,
  };

  const data = {
    labels: ['Successful', 'In Progress', 'Failed'],
    datasets: [dataset],
  };

  return (
    <div style={{ height: '180px', position: 'relative' }}>
      <h3 className="text-center">{data.datasets[0].label}</h3>
      {!!data.datasets[0].total && (
        <h1 className="text-jumbotron" style={{ left: 'calc(50% - 26px)' }}>
          {(
            (data.datasets[0].data[0] / data.datasets[0].total) *
            100
          ).toFixed()}
          %<small className="d-block">Success</small>
        </h1>
      )}
      {!data.datasets[0].total && (
        <h2 className="text-jumbotron" style={{ left: 'calc(50% - 30px)' }}>
          <span>No data</span>
        </h2>
      )}
      <Doughnut data={data} options={options} />
    </div>
  );
};
