import {
  BackupModalAction,
  SET_BACKUP_FILES,
  SET_BACKUP_LOCATIONS,
  SET_FILTERED_HYPERVISOR_STORAGES, SET_FLAVORS,
  SET_HYPERVISOR_CLUSTERS,
  SET_HYPERVISOR_MANAGERS,
  SET_HYPERVISOR_STORAGES,
  SET_TASK,
} from './types';
import { RestoreAndImportTask } from '../../model/tasks/restore-and-import-task';

export type RestoreModalStore = {
  readonly task: any;
  readonly backupLocations: any[];
  readonly hypervisorManagers: any[];
  readonly hypervisorStorages: any[];
  readonly filteredHypervisorStorages: any[];
  readonly hypervisorClusters: any[];
  readonly backupFiles: any[];
  readonly flavors: any[];
};

const initial: RestoreModalStore = {
  task: new RestoreAndImportTask(),
  backupLocations: [],
  hypervisorManagers: [],
  hypervisorStorages: [],
  filteredHypervisorStorages: [],
  hypervisorClusters: [],
  backupFiles: [],
  flavors: [],
};

export default (state = initial, action: BackupModalAction) => {
  if (action.type === SET_TASK) {
    return {
      ...state,
      task: action.payload,
    };
  }
  if (action.type === SET_BACKUP_LOCATIONS) {
    return {
      ...state,
      backupLocations: action.payload,
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
  if (action.type === SET_BACKUP_FILES) {
    return {
      ...state,
      backupFiles: action.payload,
    };
  }
  if (action.type === SET_FLAVORS) {
    return {
      ...state,
      flavors: action.payload,
    };
  }
  return state;
};
