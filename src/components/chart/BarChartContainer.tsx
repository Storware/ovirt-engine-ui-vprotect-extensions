import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button } from 'primereact/button';
import { commonSizeOptions } from 'pages/dashboard/chargeback/commonSizeOptions';
import BarChart from 'components/chart/BarChart';
import { ChartData } from 'model/ChartData';
import { Menu } from 'primereact/menu';

const prepareChartDataDays = (datasets, state) => {
  let limit = 30;
  let chartData = new ChartData(2);

  chartData.datasets[0].label = 'Backup';
  chartData.datasets[1].label = 'Restore';

  for (let i = limit - 1; i >= 0; i--) {
    chartData.labels = [...Array(30)]
      .map((item, index) => index)
      .map((el) => moment().subtract(el, 'days').format('DD-MM-YYYY'))
      .reverse();
    chartData.datasets[0].data.push(0);
    chartData.datasets[1].data.push(0);
  }

  datasets.backupsHistory.forEach((element) => {
    let time = moment(element.snapshotTime).format('DD-MM-YYYY');
    let size = element.size;
    let index = chartData.labels.indexOf(time);
    if (index >= 0) {
      let sizeAtIndex = chartData.datasets[0].data[index];
      chartData.datasets[0].data[index] =
        Math.round((sizeAtIndex + size) * 100) / 100;
    }
  });

  datasets.restoresHistory.forEach((element) => {
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
    options: commonSizeOptions('y'),
  };
};

const prepareChartDataBackups = (datasets, state) => {
  let limit = 20;
  let chartData = new ChartData(1);
  chartData.datasets[0].label = 'Backup';

  if (!datasets.backupsHistory || datasets.backupsHistory.length === 0) {
    return state;
  }

  let backups = datasets.backupsHistory.filter((value) => {
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

const prepareChartDataTime = (datasets, state) => {
  let limit = 20;
  let chartData = new ChartData(4);

  chartData.datasets[0].label = 'Export (queued) duration';
  chartData.datasets[1].label = 'Export duration';
  chartData.datasets[2].label = 'Store (queued) duration';
  chartData.datasets[3].label = 'Store duration';

  let backups = datasets.backupsHistory;

  const backupsLength = datasets.backupsHistory.length;

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

const prepareChartDataRestoreTime = (datasets, state) => {
  let limit = 20;
  let chartData = new ChartData(6);

  chartData.datasets[0].label = 'Restore (queued) duration';
  chartData.datasets[1].label = 'Restore duration';
  chartData.datasets[2].label = 'Import (queued) duration';
  chartData.datasets[3].label = 'Import duration';
  chartData.datasets[4].label = 'Mount (queued) duration';
  chartData.datasets[5].label = 'Mount duration';

  let restores = datasets.restoresHistory;

  const backupsLength = datasets.restoresHistory.length;

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

export const prepareData = {
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

export default ({ datasets }) => {
  const [state, setState] = useState({
    chartData: new ChartData(4),
    enablePrevious: true,
    shiftChart: 0,
    option: 'days',
    type: 'size',
    options: {},
  });

  useEffect(() => {
    setState({
      ...prepareData[state.option](datasets, state),
      type: type[state.option],
    });
  }, [state.option, datasets]);

  const menuDailyActivity = useRef(null);
  const menuBackup = useRef(null);
  const menuRestore = useRef(null);

  const dailyActivityMenu = [
    {
      label: 'Daily Activity',
      command: () => {
        setState({
          ...state,
          option: 'days',
        });
      },
    },
  ];

  const backupChartMenu = [
    {
      label: 'Backup Size',
      command: () => {
        setState({
          ...state,
          option: 'backups',
        });
      },
    },
    {
      label: 'Backup Time',
      command: () => {
        setState({
          ...state,
          option: 'time',
        });
      },
    },
  ];

  const restoreChartMenu = [
    {
      label: 'Restore Time',
      command: () => {
        setState({
          ...state,
          option: 'restoreTime',
        });
      },
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-end mt-3">
        <div>
          <Menu
            model={dailyActivityMenu}
            popup
            ref={menuDailyActivity}
            id="popup_menu"
          />
          <Button
            label="Daily Activity"
            onClick={(event) => menuDailyActivity.current.toggle(event)}
            aria-controls="popup_menu"
            aria-haspopup
            className="mx-2"
          />

          <Menu
            model={backupChartMenu}
            popup
            ref={menuBackup}
            id="popup_menu"
          />
          <Button
            label="Backup Statistics"
            onClick={(event) => menuBackup.current.toggle(event)}
            aria-controls="popup_menu"
            aria-haspopup
          />

          <Menu
            model={restoreChartMenu}
            popup
            ref={menuRestore}
            id="popup_menu"
          />
          <Button
            label="Restore Statistics"
            onClick={(event) => menuRestore.current.toggle(event)}
            aria-controls="popup_menu"
            aria-haspopup
            className="mx-2"
          />
        </div>
      </div>
      <BarChart data={state.chartData} chartType={state.type} />
    </div>
  );
};
