export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const HIDE_FOOTER = 'HIDE_FOOTER';
export const SHOW_FOOTER = 'SHOW_FOOTER';
export const SAVE_MODAL = 'SAVE_MODAL';
export const UNSAVE_MODAL = 'UNSAVE_MODAL';

export type ShowModalAction = {
  type: typeof SHOW_MODAL;
  payload: {
    component: any;
    props: any;
    title: string;
    buttonLabel: string;
  };
};

export type HideModalAction = {
  type: typeof HIDE_MODAL;
};

export type HideFooterAction = {
  type: typeof HIDE_FOOTER;
};

export type ShowFooterAction = {
  type: typeof SHOW_FOOTER;
};

export type SaveModalAction = {
  type: typeof SAVE_MODAL;
};

export type UnsaveModalAction = {
  type: typeof UNSAVE_MODAL;
};

export type ModalAction =
  | ShowFooterAction
  | ShowModalAction
  | HideModalAction
  | HideFooterAction
  | SaveModalAction
  | UnsaveModalAction;
