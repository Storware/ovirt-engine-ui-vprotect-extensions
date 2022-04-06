import { RootState } from '../index';

export const selectNetwork = (store: RootState) => store.network.network;
