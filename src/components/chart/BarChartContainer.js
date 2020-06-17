import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import { ChartData } from '../../model/ChartData';
import { Button } from 'primereact/button';

const stackedOptions = {
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  responsive: true,
  scales: {
    xAxes: [
      {
        stacked: true,
      },
    ],
    yAxes: [
      {
        stacked: true,
      },
    ],
  },
};

const prepareChartDataDays = (props, state) => {
  let limit = 30;
  let chartData = new ChartData(2);

  chartData.datasets[0].label = 'Backup';
  chartData.datasets[1].label = 'Restore';

  for (let i = limit - 1; i >= 0; i--) {
    chartData.labels.push(
      moment()
        .subtract(i + state.shiftChart, 'days')
        .format('DD-MM-YYYY'),
    );
    chartData.datasets[0].data.push(0);
    chartData.datasets[1].data.push(0);
  }

  props.datasets.backupsHistory.forEach((element) => {
    let time = moment(element.snapshotTime).format('DD-MM-YYYY');
    let size = element.size;
    let index = chartData.labels.indexOf(time);
    if (index >= 0) {
      let sizeAtIndex = chartData.datasets[0].data[index];
      chartData.datasets[0].data[index] =
        Math.round((sizeAtIndex + size) * 100) / 100;
    }
  });

  props.datasets.restoresHistory.forEach((element) => {
    let time = moment(element.restoreTime).format('DD-MM-YYYY');
    let size = element.backup.size;
    let index = chartData.labels.indexOf(time);
    if (index >= 0) {
      let sizeAtIndex = chartData.datasets[1].data[index];
      chartData.datasets[1].data[index] =
        Math.round((sizeAtIndex + size) * 100) / 100;
    }
  });

  return {
    ...state,
    chartData: chartData,
    options: stackedOptions,
  };
};

const prepareChartDataBackups = (props, state) => {
  let limit = 20;
  let chartData = new ChartData(1);
  chartData.datasets[0].label = 'Backup';

  if (
    !props.datasets.backupsHistory ||
    props.datasets.backupsHistory.length === 0
  ) {
    return state;
  }

  let backups = props.datasets.backupsHistory.filter((value) => {
    return (
      value.status.name === 'SUCCESS_REMOVED' || value.status.name === 'SUCCESS'
    );
  });

  let shiftChart = state.shiftChart;
  let enablePrevious = state.enablePrevious;

  if (limit + shiftChart > backups.length) {
    shiftChart = backups.length - limit;
    enablePrevious = false;
  }

  for (let i = limit - 1 + shiftChart; i >= 0 + shiftChart; i--) {
    if (backups[i]) {
      chartData.labels.push(
        moment(backups[i].backupTime).format('DD-MM-YYYY HH:mm'),
      );
      chartData.datasets[0].data.push(backups[i].size);
    }
  }

  return {
    ...state,
    enablePrevious: enablePrevious,
    shiftChart: shiftChart,
    chartData: chartData,
  };
};

const prepareChartDataTime = (props, state) => {
  let limit = 20;
  let chartData = new ChartData(4);

  chartData.datasets[0].label = 'Export (queued) duration';
  chartData.datasets[1].label = 'Export duration';
  chartData.datasets[2].label = 'Store (queued) duration';
  chartData.datasets[3].label = 'Store duration';

  let backups = props.datasets.backupsHistory;

  const backupsLength = props.datasets.backupsHistory.length;

  let shiftChart = state.shiftChart;
  let enablePrevious = state.enablePrevious;

  if (limit + shiftChart > backupsLength) {
    shiftChart = backupsLength - limit;
    enablePrevious = false;
  }

  for (let i = limit - 1 + shiftChart; i >= 0 + shiftChart; i--) {
    if (backups[i]) {
      chartData.labels.push(
        moment(backups[i].snapshotTime).format('DD-MM-YYYY HH:mm'),
      );
      const exportTime = backups[i].taskTimeStats.exportTime;
      const queuedExportTime = backups[i].taskTimeStats.queuedExportTime;
      const storeTime = backups[i].taskTimeStats.storeTime;
      const queuedStoreTime = backups[i].taskTimeStats.queuedStoreTime;
      const total = exportTime + queuedExportTime + storeTime + queuedStoreTime;
      if (chartData.max < total) {
        chartData.max = total;
      }
      chartData.datasets[0].data.push(queuedExportTime);
      chartData.datasets[1].data.push(exportTime);
      chartData.datasets[2].data.push(queuedStoreTime);
      chartData.datasets[3].data.push(storeTime);
    }
  }

  return {
    ...state,
    enablePrevious: enablePrevious,
    shiftChart: shiftChart,
    chartData: chartData,
  };
};

const prepareChartDataRestoreTime = (props, state) => {
  let limit = 20;
  let chartData = new ChartData(6);

  chartData.datasets[0].label = 'Restore (queued) duration';
  chartData.datasets[1].label = 'Restore duration';
  chartData.datasets[2].label = 'Import (queued) duration';
  chartData.datasets[3].label = 'Import duration';
  chartData.datasets[4].label = 'Mount (queued) duration';
  chartData.datasets[5].label = 'Mount duration';

  let restores = props.datasets.restoresHistory;

  const backupsLength = props.datasets.restoresHistory.length;

  let shiftChart = state.shiftChart;
  let enablePrevious = state.enablePrevious;

  if (limit + shiftChart > backupsLength) {
    shiftChart = backupsLength - limit;
    enablePrevious = false;
  }

  for (let i = limit - 1 + shiftChart; i >= 0 + shiftChart; i--) {
    if (restores[i]) {
      chartData.labels.push(
        moment(restores[i].restoreTime).format('DD-MM-YYYY HH:mm'),
      );
      const importTime = restores[i].taskTimeStats.importTime;
      const mountTime = restores[i].taskTimeStats.mountTime;
      const queuedImportTime = restores[i].taskTimeStats.queuedImportTime;
      const queuedMountTime = restores[i].taskTimeStats.queuedMountTime;
      const queuedRestoreTime = restores[i].taskTimeStats.queuedRestoreTime;
      const restoreTime = restores[i].taskTimeStats.restoreTime;
      const total =
        importTime +
        mountTime +
        queuedImportTime +
        queuedMountTime +
        queuedRestoreTime +
        restoreTime;
      if (chartData.max < total) {
        chartData.max = total;
      }
      chartData.datasets[0].data.push(queuedRestoreTime);
      chartData.datasets[1].data.push(restoreTime);
      chartData.datasets[2].data.push(queuedImportTime);
      chartData.datasets[3].data.push(importTime);
      chartData.datasets[4].data.push(queuedMountTime);
      chartData.datasets[5].data.push(mountTime);
    }
  }

  return {
    ...state,
    enablePrevious: enablePrevious,
    shiftChart: shiftChart,
    chartData: chartData,
  };
};

const prepareData = {
  days: prepareChartDataDays,
  backups: prepareChartDataBackups,
  time: prepareChartDataTime,
  restoreTime: prepareChartDataRestoreTime,
};

const type = {
  days: 'size',
  backups: 'size',
  time: 'time',
  restoreTime: 'time',
};

export class BarChartContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: new ChartData(),
      enablePrevious: true,
      shiftChart: 0,
      option: 'days',
      type: 'size',
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...prepareData[state.option](props, state),
      type: type[state.option],
    };
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-end mt-3">
          <div>
            <Button
              className="mx-2"
              label="Daily activity"
              onClick={() => {
                this.setState({
                  ...this.state,
                  option: 'days',
                });
              }}
            />
            <Button
              className="mx-2"
              label="Backup size"
              onClick={() => {
                this.setState({
                  ...this.state,
                  option: 'backups',
                });
              }}
            />
            <Button
              className="mx-2"
              label="Backup time"
              onClick={() => {
                this.setState({
                  ...this.state,
                  option: 'time',
                });
              }}
            />
            <Button
              className="mx-2"
              label="Restore time"
              onClick={() => {
                this.setState({
                  ...this.state,
                  option: 'restoreTime',
                });
              }}
            />
          </div>
        </div>
        <BarChart
          data={this.state.chartData}
          options={this.state.options}
          chartType={this.state.type}
        />
      </div>
    );
  }
}

export default BarChartContainer;

BarChartContainer.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  datasets: PropTypes.any.isRequired,
};
