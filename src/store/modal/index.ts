import {
  HIDE_MODAL,
  HIDE_FOOTER,
  ModalAction,
  SAVE_MODAL,
  SHOW_MODAL,
  UNSAVE_MODAL,
} from './types';

export type ModalStore = {
  readonly modal: { component: () => JSX.Element; props; title: string, buttonLabel: string };
  readonly show: boolean;
  readonly hideFooter: boolean;
  readonly saved: boolean;
};

const initial: ModalStore = {
  modal: null,
  show: false,
  hideFooter: false,
  saved: false,
};

export default (state = initial, action: ModalAction) => {
  if (action.type === SHOW_MODAL) {
    return {
      ...state,
      modal: action.payload,
      show: true,
    };
  }
  if (action.type === HIDE_MODAL) {
    return {
      ...state,
      modal: null,
      show: false,
      saved: false,
    };
  }
  if (action.type === HIDE_FOOTER) {
    return {
      ...state,
      hideFooter: true,
    };
  }
  if (action.type === SAVE_MODAL) {
    return {
      ...state,
      saved: true,
    };
  }
  if (action.type === UNSAVE_MODAL) {
    return {
      ...state,
      saved: false,
    };
  }
  return state;
};
