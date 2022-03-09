import { RootState } from '../index';

export const selectCredentials = (store: RootState) =>
  store.credentials.credentials;

export const selectSelectedCredential = (store: RootState) =>
  store.credentials.selectedCredential;
