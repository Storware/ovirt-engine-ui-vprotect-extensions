import { ChargebackChartFormAction, SET_PROPERTY_OPTIONS } from './types';

export type ChargebackChartForm = {
  readonly propertyOptions;
};

const initial: ChargebackChartForm = {
  propertyOptions: {},
};

export default (state = initial, action: ChargebackChartFormAction) => {
  if (action.type === SET_PROPERTY_OPTIONS) {
    return {
      ...state,
      propertyOptions: action.payload,
    };
  }
  return state;
};
