import { RootState } from '../index';

export const selectChartData = (store: RootState) =>
  store.chargebackChart.chartData;
export const selectSortBy = (store: RootState) => store.chargebackChart.sortBy;
export const selectPage = (store: RootState) => store.chargebackChart.page;
