import { ChargebackChartFormAction, SET_OPTIONS } from './types';

export type ChargebackChartForm = {
  readonly optionsObject;
};

const initial: ChargebackChartForm = {
  optionsObject: {},
};

export default (state = initial, action: ChargebackChartFormAction) => {
  if (action.type === SET_OPTIONS) {
    return {
      ...state,
      optionsObject: action.payload,
    };
  }
  return state;
};
