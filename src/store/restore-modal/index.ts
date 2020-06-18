import {
  BackupModalAction,
  SET_BACKUPS, SET_HYPERVISOR_CLUSTERS, SET_FILTERED_HYPERVISOR_STORAGES,
  SET_HYPERVISOR_MANAGERS, SET_HYPERVISOR_STORAGES, SET_TASK,
} from './types';
import {RestoreAndImportTask} from '../../model/tasks/restore-and-import-task';

export type RestoreModalStore = {
  readonly task: any;
  readonly backups: any[];
  readonly hypervisorManagers: any[];
  readonly hypervisorStorages: any[];
  readonly filteredHypervisorStorages: any[];
  readonly hypervisorClusters: any[];
};

const initial: RestoreModalStore = {
  task: new RestoreAndImportTask(),
  backups: [],
  hypervisorManagers: [],
  hypervisorStorages: [],
  filteredHypervisorStorages: [],
  hypervisorClusters: [],
};

export default (state = initial, action: BackupModalAction) => {
  if (action.type === SET_TASK) {
    return {
      ...state,
      task: action.payload,
    };
  }  if (action.type === SET_BACKUPS) {
    return {
      ...state,
      backups: action.payload,
    };
  }
  if (action.type === SET_HYPERVISOR_MANAGERS) {
    return {
      ...state,
      hypervisorManagers: action.payload,
    };
  }
  if (action.type === SET_HYPERVISOR_STORAGES) {
    return {
      ...state,
      hypervisorStorages: action.payload,
      filteredHypervisorStorages: action.payload,
    };
  }
  if (action.type === SET_FILTERED_HYPERVISOR_STORAGES) {
    return {
      ...state,
      filteredHypervisorStorages: action.payload,
    };
  }
  if (action.type === SET_HYPERVISOR_CLUSTERS) {
    return {
      ...state,
      hypervisorClusters: action.payload,
    };
  }
  return state;
};
