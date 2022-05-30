import {
  SHOW_FOOTER,
  HIDE_FOOTER,
  HIDE_MODAL,
  ModalAction,
  SAVE_MODAL,
  SHOW_MODAL,
  UNSAVE_MODAL,
} from './types';

export const showModalAction = (payload: any): ModalAction => ({
  type: SHOW_MODAL,
  payload,
});

export const hideModalAction = (): ModalAction => ({
  type: HIDE_MODAL,
});

export const hideFooterAction = (): ModalAction => ({
  type: HIDE_FOOTER,
});

export const showFooterAction = (): ModalAction => ({
  type: SHOW_FOOTER,
});

export const saveModalAction = (): ModalAction => ({
  type: SAVE_MODAL,
});

export const unsaveModalAction = (): ModalAction => ({
  type: UNSAVE_MODAL,
});
