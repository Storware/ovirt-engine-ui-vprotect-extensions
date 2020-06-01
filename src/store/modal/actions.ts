import {HIDE_MODAL, ModalAction, SAVE_MODAL, SHOW_MODAL, UNSAVE_MODAL} from './types';

export const showModal = (payload: any): ModalAction => {
    return {
        type: SHOW_MODAL,
        payload
    };
};

export const hideModal = (): ModalAction => {
    return {
        type: HIDE_MODAL
    };
};

export const saveModal = (): ModalAction => {
    return {
        type: SAVE_MODAL
    };
};

export const unsaveModal = (): ModalAction => {
    return {
        type: UNSAVE_MODAL
    };
};
