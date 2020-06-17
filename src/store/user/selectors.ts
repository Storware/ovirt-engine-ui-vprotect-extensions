import { RootState } from '../index';

export const selectUser = (store: RootState) => store.user.user;
