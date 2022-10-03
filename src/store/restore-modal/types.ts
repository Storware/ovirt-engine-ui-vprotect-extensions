export const SET_TASK = 'SET_TASK';
export const RESET_TASK = 'RESET_TASK';
export const SET_BACKUP_LOCATIONS = 'SET_BACKUP_LOCATIONS';
export const SET_HYPERVISOR_MANAGERS = 'SET_HYPERVISOR_MANAGERS';
export const SET_HYPERVISOR_STORAGES = 'SET_HYPERVISOR_STORAGES';
export const SET_FILTERED_HYPERVISOR_STORAGES =
  'SET_FILTERED_HYPERVISOR_STORAGES';
export const SET_HYPERVISOR_CLUSTERS = 'SET_HYPERVISOR_CLUSTERS';

export type SetTaskAction = {
  type: typeof SET_TASK;
  payload?: any;
};

export type SetBackupLocationsAction = {
  type: typeof SET_BACKUP_LOCATIONS;
  payload?: any;
};

export type SetHypervisorManagerAction = {
  type: typeof SET_HYPERVISOR_MANAGERS;
  payload?: any;
};

export type SetHypervisorStoragesAction = {
  type: typeof SET_HYPERVISOR_STORAGES;
  payload?: any;
};

export type SetFilteredHypervisorStoragesAction = {
  type: typeof SET_FILTERED_HYPERVISOR_STORAGES;
  payload?: any;
};

export type SetHypervisorClustersAction = {
  type: typeof SET_HYPERVISOR_CLUSTERS;
  payload?: any;
};

export type ResetTask = {
  type: typeof RESET_TASK;
};

export type BackupModalAction =
  | SetTaskAction
  | SetBackupLocationsAction
  | SetHypervisorManagerAction
  | SetHypervisorStoragesAction
  | SetFilteredHypervisorStoragesAction
  | SetHypervisorClustersAction
  | ResetTask;
