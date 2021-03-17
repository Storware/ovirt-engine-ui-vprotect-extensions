import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { getReport } from 'store/reporting/actions';
import { Doughnut } from 'react-chartjs-2';
import { Report } from 'model/report/report';

const backgroundColor = ['#0f9d58', '#38689E', '#c70015'];

export default () => {
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(range);
    dispatch(getReport(range));
  }, [range]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    legend: {
      display: false,
    },
  };

  const dataset = (type) => {
    const label = {};

    return {
      label: '# of Votes',
      data: [
        report.backups.successful,
        report.backups.inProgress,
        report.backups.failed,
      ],
      backgroundColor,
      borderWidth: 1,
    };
  };

  const data = {
    labels: ['Successful', 'In Progress', 'Failed'],
    datasets: [
      {
        label: '# of Votes',
        data: [
          report.backups.successful,
          report.backups.inProgress,
          report.backups.failed,
        ],
        backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    // @ts-ignore
    <div style={{ height: '180px', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
