import { RootState } from '../index';

export const selectMailing = (store: RootState) =>
    store.mailing.mailing
