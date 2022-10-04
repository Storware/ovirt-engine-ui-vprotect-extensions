import {
  BackupModalAction,
  SET_BACKUP_LOCATIONS,
  SET_FILTERED_HYPERVISOR_STORAGES,
  SET_HYPERVISOR_CLUSTERS,
  SET_HYPERVISOR_MANAGERS,
  SET_HYPERVISOR_STORAGES,
  SET_TASK,
} from './types';
import { RestoreAndImportTask } from '../../model/tasks/restore-and-import-task';
import {RESET_TASK} from '../mount-backup-modal/types';

export type RestoreModalStore = {
  readonly task: any;
  readonly backupLocations: any[];
  readonly hypervisorManagers: any[];
  readonly hypervisorStorages: any[];
  readonly filteredHypervisorStorages: any[];
  readonly hypervisorClusters: any[];
};

const initial: RestoreModalStore = {
  task: new RestoreAndImportTask(),
  backupLocations: [],
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

  if (action.type === RESET_TASK) {
    return initial;
  }

  return state;
};
