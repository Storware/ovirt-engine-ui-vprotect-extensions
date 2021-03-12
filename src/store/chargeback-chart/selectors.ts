import { RootState } from '../index';

export const selectChartData = (store: RootState) =>
  store.chargebackChart.chartData;
export const selectSortedChartData = (store: RootState) =>
  store.chargebackChart.sortedChartData;
export const selectPaginatedChartData = (store: RootState) =>
  store.chargebackChart.paginatedChartData;
export const selectSortBy = (store: RootState) => store.chargebackChart.sortBy;
export const selectPage = (store: RootState) => store.chargebackChart.page;
