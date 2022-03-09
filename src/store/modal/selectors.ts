import { RootState } from '../index';

export const selectModal = (store: RootState) => store.modal.modal;
export const selectShow = (store: RootState) => store.modal.show;
export const hideFooter = (store: RootState) => store.modal.hideFooter;
export const selectSaved = (store: RootState) => store.modal.saved;
