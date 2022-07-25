import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button } from 'primereact/button';
import { commonSizeOptions } from 'pages/dashboard/chargeback/commonSizeOptions';
import BarChart from 'components/chart/BarChart';
import { ChartData } from 'model/ChartData';
import { Menu } from 'primereact/menu';

type DateRange = [Date, Date];

const selectedDays = ([startDate, endDate]: DateRange) => {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const treatAsUTC = (date: Date) =>
    new Date(date).setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return (
    Math.floor(
      (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay,
    ) + 1
  );
};

const prepareChartDataDays = (datasets, state, dateRange: DateRange) => {
  const [startDate] = dateRange;
  const chartData = new ChartData(2);

  chartData.datasets[0].label = 'Backup';
  chartData.datasets[1].label = 'Restore';

  chartData.labels = [...Array(selectedDays(dateRange))].map((_, index) =>
    moment(startDate).add(index, 'days').format('DD-MM-YYYY'),
  );

  chartData.labels.forEach(() => {
    chartData.datasets[0].data.push(0);
    chartData.datasets[1].data.push(0);
  });

  datasets.backupsHistory.forEach((element) => {
    const time = moment(element.snapshotTime).format('DD-MM-YYYY');
    const size = element.size;
    const index = chartData.labels.indexOf(time);
    if (index >= 0) {
      const sizeAtIndex = chartData.datasets[0].data[index];
      chartData.datasets[0].data[index] =
        Math.round((sizeAtIndex + size) * 100) / 100;
    }
  });

  datasets.restoresHistory.forEach((element) => {
    const time = moment(element.restoreTime).format('DD-MM-YYYY');
    const size = element.backup?.size;
    const index = chartData.labels.indexOf(time);
    if (index >= 0) {
      const sizeAtIndex = chartData.datasets[1].data[index];
      chartData.datasets[1].data[index] =
        Math.round((sizeAtIndex + size) * 100) / 100;
    }
  });

  return {
    ...state,
    chartData,
    options: commonSizeOptions('y'),
  };
};

const prepareChartDataBackups = (datasets, state) => {
  const chartData = new ChartData(1);
  const shiftChart = state.shiftChart;
  const enablePrevious = state.enablePrevious;

  chartData.datasets[0].label = 'Backup';

  const backups = datasets.backupsHistory.filter(({ status: { name } }) =>
    ['SUCCESS_REMOVED', 'SUCCESS'].includes(name),
  );

  [...backups].reverse().forEach((backup) => {
    chartData.labels.push(moment(backup.backupTime).format('DD-MM-YYYY HH:mm'));
    chartData.datasets[0].data.push(backup.size);
  });

  return {
    ...state,
    enablePrevious,
    shiftChart,
    chartData,
  };
};

const prepareChartDataTime = (datasets, state) => {
  const shiftChart = state.shiftChart;
  const enablePrevious = state.enablePrevious;
  const backups = datasets.backupsHistory;
  const chartData = new ChartData(4);
  [
    'Export (queued) duration',
    'Export duration',
    'Store (queued) duration',
    'Store duration',
  ].forEach((label, id) => {
    chartData.datasets[id].label = label;
  });
  [...backups].reverse().forEach(({ taskTimeStats, snapshotTime }) => {
    const { exportTime, queuedExportTime, storeTime, queuedStoreTime } =
      taskTimeStats;

    chartData.labels.push(moment(snapshotTime).format('DD-MM-YYYY HH:mm'));
    [queuedExportTime, exportTime, queuedStoreTime, storeTime].forEach(
      (dataElement, id) => {
        chartData.datasets[id].data.push(dataElement);
      },
    );

    const total = exportTime + queuedExportTime + storeTime + queuedStoreTime;
    if (chartData.max < total) {
      chartData.max = total;
    }
  });

  return {
    ...state,
    enablePrevious,
    shiftChart,
    chartData,
  };
};

const prepareChartDataRestoreTime = (datasets, state) => {
  const chartData = new ChartData(6);
  const restores = datasets.restoresHistory;
  const { shiftChart, enablePrevious } = state;

  [
    'Restore (queued) duration',
    'Restore duration',
    'Import (queued) duration',
    'Import duration',
    'Mount (queued) duration',
    'Mount duration',
  ].forEach((label, id) => (chartData.datasets[id].label = label));

  [...restores]
    .reverse()
    .forEach(({ restoreTime: backupRestoreTime, taskTimeStats }) => {
      const {
        importTime,
        mountTime,
        queuedImportTime,
        queuedMountTime,
        queuedRestoreTime,
        restoreTime,
      } = taskTimeStats;

      chartData.labels.push(
        moment(backupRestoreTime).format('DD-MM-YYYY HH:mm'),
      );

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
      [
        queuedRestoreTime,
        restoreTime,
        queuedImportTime,
        importTime,
        queuedMountTime,
        mountTime,
      ].forEach((dataToPush, id) =>
        chartData.datasets[id].data.push(dataToPush),
      );
    });

  return {
    ...state,
    enablePrevious,
    shiftChart,
    chartData,
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

export default ({
  datasets,
  dateRange,
}: {
  datasets: unknown;
  dateRange: DateRange;
}) => {
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
      ...prepareData[state.option](datasets, state, dateRange),
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
