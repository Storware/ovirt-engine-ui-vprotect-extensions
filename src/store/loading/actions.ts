import {LoadingAction, START, STOP} from './types';

export const startLoading = (): LoadingAction => {
    return {
        type: START
    };
};

export const stopLoading = (): LoadingAction => {
    return {
        type: STOP
    };
};

