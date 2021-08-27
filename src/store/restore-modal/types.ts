export const SET_TASK = 'SET_TASK';
export const SET_BACKUPS = 'SET_BACKUPS';
export const SET_HYPERVISOR_MANAGERS = 'SET_HYPERVISOR_MANAGERS';
export const SET_HYPERVISOR_STORAGES = 'SET_HYPERVISOR_STORAGES';
export const SET_FILTERED_HYPERVISOR_STORAGES = 'SET_FILTERED_HYPERVISOR_STORAGES';
export const SET_HYPERVISOR_CLUSTERS = 'SET_HYPERVISOR_CLUSTERS';
export const SET_PROJECTS_FOR_HYPERVISOR_MANAGER = 'SET_PROJECTS_FOR_HYPERVISOR_MANAGER';

export type SetTaskAction = {
  type: typeof SET_TASK;
  payload?: any;
};

export type SetBackupsAction = {
  type: typeof SET_BACKUPS;
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

export type SetProjectsForHypervisorManager = {
  type: typeof SET_PROJECTS_FOR_HYPERVISOR_MANAGER;
  payload?: any;
};

export type BackupModalAction =
    SetTaskAction |
    SetBackupsAction |
    SetHypervisorManagerAction |
    SetHypervisorStoragesAction |
    SetFilteredHypervisorStoragesAction |
    SetHypervisorClustersAction | SetProjectsForHypervisorManager;
