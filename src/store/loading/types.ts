export const START = 'START';
export const STOP = 'STOP';

export type StartAction = {
  type: typeof START;
};

export type StopAction = {
  type: typeof STOP;
};

export type LoadingAction = StartAction | StopAction;
