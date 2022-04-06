import { NetworkAction, SET_NETWORK, SET_NETWORK_COPY } from './types';

export type NetworkStore = {
  readonly network: any[];
};

const initial: NetworkStore = {
  network: [],
};

export default (state = initial, action: NetworkAction) => {
  if (action.type === SET_NETWORK) {
    return {
      ...state,
      network: action.payload,
    };
  }

  return state;
};
