import {HIDE_MODAL, ModalAction, SAVE_MODAL, SHOW_MODAL, UNSAVE_MODAL} from './types';

export const showModalAction = (payload: any): ModalAction => {
    return {
        type: SHOW_MODAL,
        payload
    };
};

export const hideModalAction = (): ModalAction => {
    return {
        type: HIDE_MODAL
    };
};

export const saveModalAction = (): ModalAction => {
    return {
        type: SAVE_MODAL
    };
};

export const unsaveModalAction = (): ModalAction => {
    return {
        type: UNSAVE_MODAL
    };
};
