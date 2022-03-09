import { RootState } from '../index';

export const selectNetwork = (store: RootState) => store.network.network;
export const selectNetworkCopy = (store: RootState) =>
  store.network.networkCopy;
