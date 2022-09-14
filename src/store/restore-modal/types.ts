export const SET_TASK = 'SET_TASK';
export const SET_BACKUP_LOCATIONS = 'SET_BACKUP_LOCATIONS';
export const SET_BACKUP_FILES = 'SET_BACKUP_FILES';
export const SET_HYPERVISOR_MANAGERS = 'SET_HYPERVISOR_MANAGERS';
export const SET_HYPERVISOR_STORAGES = 'SET_HYPERVISOR_STORAGES';
export const SET_FILTERED_HYPERVISOR_STORAGES =
  'SET_FILTERED_HYPERVISOR_STORAGES';
export const SET_HYPERVISOR_CLUSTERS = 'SET_HYPERVISOR_CLUSTERS';
export const SET_FLAVORS = 'SET_FLAVORS';
export const SET_RESTORE_CLUSTER_ID = 'SET_RESTORE_CLUSTER_ID';
export const RESET_TASK = 'RESET_TASK';

export type SetTaskAction = {
  type: typeof SET_TASK;
  payload?: any;
};

export type SetBackupLocationsAction = {
  type: typeof SET_BACKUP_LOCATIONS;
  payload?: any;
};

export type SetBackupFilesAction = {
  type: typeof SET_BACKUP_FILES;
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

export type SetFlavors = {
  type: typeof SET_FLAVORS;
  payload?: any;
};

export type SetRestoreClusterId = {
  type: typeof SET_RESTORE_CLUSTER_ID;
  payload?: any;
};

export type ResetTask = {
  type: typeof RESET_TASK;
};

export type BackupModalAction =
  | SetTaskAction
  | SetBackupLocationsAction
  | SetBackupFilesAction
  | SetHypervisorManagerAction
  | SetHypervisorStoragesAction
  | SetFilteredHypervisorStoragesAction
  | SetHypervisorClustersAction
  | SetFlavors
  | ResetTask
  | SetRestoreClusterId;
