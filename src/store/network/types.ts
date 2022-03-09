export const SET_NETWORK = 'SET_NETWORK';
export const SET_NETWORK_COPY = 'SET_NETWORK_COPY';

export type SetNetworkAction = {
  type: typeof SET_NETWORK;
  payload?: any;
};

export type SetNetworkCopyAction = {
  type: typeof SET_NETWORK_COPY;
  payload?: any;
};

export type NetworkAction = SetNetworkAction | SetNetworkCopyAction;
