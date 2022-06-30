import { RootState } from '../index';

export const selectBackupSizeChartData = (store: RootState) =>
  store.chargebackChart.chartDataBackupSize;
export const selectTransferSizeChartData = (store: RootState) =>
  store.chargebackChart.chartDataTransferSize;
export const selectSortBy = (store: RootState) => store.chargebackChart.sortBy;
export const selectPage = (store: RootState) => store.chargebackChart.page;
