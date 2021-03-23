import { RootState } from '../index';

export const selectOptionsObject = (store: RootState) =>
  store.chargebackChartForm.optionsObject;
