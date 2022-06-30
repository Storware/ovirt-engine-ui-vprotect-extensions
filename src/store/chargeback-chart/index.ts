import {
  ChargebackChartAction,
  SET_CHARGEBACK_BACKUP_SIZE_DATA,
  SET_CHARGEBACK_TRANSFER_SIZE_DATA,
  SET_PAGE,
  SET_SORT_BY,
} from './types';

const chartData = {
  labels: [],
  datasets: [{ data: [], label: '' }],
};

export type ChargebackChart = {
  readonly chartDataBackupSize;
  readonly chartDataTransferSize;
  readonly sortBy;
  readonly page: number;
};

const initial: ChargebackChart = {
  chartDataBackupSize: chartData,
  chartDataTransferSize: chartData,
  sortBy: {
    size: null,
    name: null,
  },
  page: 0,
};

export default (state = initial, action: ChargebackChartAction) => {
  if (action.type === SET_CHARGEBACK_BACKUP_SIZE_DATA) {
    return {
      ...state,
      chartDataBackupSize: action.payload,
      sortBy: initial.sortBy,
      page: initial.page,
    };
  }

  if (action.type === SET_CHARGEBACK_TRANSFER_SIZE_DATA) {
    return {
      ...state,
      chartDataTransferSize: action.payload,
      sortBy: initial.sortBy,
      page: initial.page,
    };
  }
  if (action.type === SET_SORT_BY) {
    return {
      ...state,
      sortBy: action.payload,
    };
  }
  if (action.type === SET_PAGE) {
    return {
      ...state,
      page: action.payload,
    };
  }
  return state;
};
