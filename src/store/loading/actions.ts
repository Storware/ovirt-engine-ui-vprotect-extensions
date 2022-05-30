import { LoadingAction, START, STOP } from './types';

export const startLoading = (): LoadingAction => ({
  type: START,
});

export const stopLoading = (): LoadingAction => ({
  type: STOP,
});
