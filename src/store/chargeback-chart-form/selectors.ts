import { RootState } from '../index';

export const selectPropertyOptions = (store: RootState) =>
  store.chargebackChartForm.propertyOptions;
