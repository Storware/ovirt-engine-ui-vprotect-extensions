import {LoadingAction, START, STOP} from './types';

export type LoadingStore = {
    readonly loading: boolean;
};

const initial: LoadingStore = {
    loading: false,
};

export default (state = initial, action: LoadingAction) => {
    if (action.type === START) {
        return {
            loading: true
        };
    }
    if (action.type === STOP) {
        return {
            loading: false
        };
    }
    return state;
};
