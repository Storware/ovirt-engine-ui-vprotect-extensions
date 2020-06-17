import {
  HIDE_MODAL,
  ModalAction,
  SAVE_MODAL,
  SHOW_MODAL,
  UNSAVE_MODAL,
} from './types';

export type ModalStore = {
  readonly modal: any;
  readonly props: any;
  readonly show: boolean;
  readonly saved: boolean;
};

const initial: ModalStore = {
  modal: null,
  props: null,
  show: false,
  saved: false,
};

export default (state = initial, action: ModalAction) => {
  if (action.type === SHOW_MODAL) {
    return {
      ...state,
      modal: action.payload.modal,
      props: action.payload.props,
      show: true,
    };
  }
  if (action.type === HIDE_MODAL) {
    return {
      ...state,
      modal: null,
      props: null,
      show: false,
      saved: false,
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
