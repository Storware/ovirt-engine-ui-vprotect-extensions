import { NetworkAction, SET_NETWORK, SET_NETWORK_COPY } from './types';

export type NetworkStore = {
  readonly network: any[];
  readonly networkCopy: any[];
};

const initial: NetworkStore = {
  network: [],
  networkCopy: [],
};

export default (state = initial, action: NetworkAction) => {
  if (action.type === SET_NETWORK) {
    return {
      ...state,
      network: action.payload,
    };
  }

  if (action.type === SET_NETWORK_COPY) {
    return {
      ...state,
      networkCopy: action.payload,
    };
  }

  return state;
};
