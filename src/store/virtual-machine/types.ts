export const SET_VIRTUAL_MACHINE = 'SET_VIRTUAL_MACHINE';
export const SET_HYPERVISOR = 'SET_HYPERVISOR';
export const SET_BACKUPS = 'SET_BACKUPS';
export const SET_BACKUPS_HISTORY = 'SET_BACKUPS_HISTORY';
export const SET_RESTORES_HISTORY = 'SET_RESTORES_HISTORY';
export const SET_SNAPSHOTS = 'SET_SNAPSHOTS';
export const SET_SNAPSHOTS_HISTORY = 'SET_SNAPSHOTS_HISTORY';
export const SET_DISKS = 'SET_DISKS';
export const SET_SCHEDULES = 'SET_SCHEDULES';
export const SET_POLICIES = 'SET_POLICIES';
export const SET_SNAPSHOT_POLICIES = 'SET_SNAPSHOT_POLICIES';

export type SetVirtualMachineAction = {
  type: typeof SET_VIRTUAL_MACHINE;
  payload?: any;
};

export type SetHypervisorAction = {
  type: typeof SET_HYPERVISOR;
  payload?: any;
};

export type SetBackupsAction = {
  type: typeof SET_BACKUPS;
  payload?: any;
};

export type SetBackupsHistoryAction = {
  type: typeof SET_BACKUPS_HISTORY;
  payload?: any;
};

export type SetRestoresHistoryAction = {
  type: typeof SET_RESTORES_HISTORY;
  payload?: any;
};

export type SetSnapshotsAction = {
  type: typeof SET_SNAPSHOTS;
  payload?: any;
};

export type SetSnapshotsHistoryAction = {
  type: typeof SET_SNAPSHOTS_HISTORY;
  payload?: any;
};

export type SetDisksAction = {
  type: typeof SET_DISKS;
  payload?: any;
};

export type SetSchedulesAction = {
  type: typeof SET_SCHEDULES;
  payload?: any;
};

export type SetPoliciesAction = {
  type: typeof SET_POLICIES;
  payload?: any;
};

export type SetSnapshotPoliciesAction = {
  type: typeof SET_SNAPSHOT_POLICIES;
  payload?: any;
};

export type VirtualMachineAction =
  | SetVirtualMachineAction
  | SetHypervisorAction
  | SetBackupsAction
  | SetBackupsHistoryAction
  | SetRestoresHistoryAction
  | SetSnapshotsAction
  | SetSnapshotsHistoryAction
  | SetDisksAction
  | SetSchedulesAction
  | SetPoliciesAction
  | SetSnapshotPoliciesAction;
