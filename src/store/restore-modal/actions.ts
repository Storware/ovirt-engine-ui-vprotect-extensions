import {
  BackupModalAction,
  SET_BACKUP_LOCATIONS,
  SET_FILTERED_HYPERVISOR_STORAGES,
  SET_HYPERVISOR_CLUSTERS,
  SET_HYPERVISOR_MANAGERS,
  SET_HYPERVISOR_STORAGES,
  SET_TASK,
} from './types';
import { Dispatch } from 'redux';
import { backupsService } from '../../services/backups-service';
import { tasksService } from '../../services/tasks-service';
import { hypervisorsService } from '../../services/hypervisors-service';
import { alertService } from 'services/alert-service';
import { hideModalAction, unsaveModalAction } from '../modal/actions';
import { RestoreAndImportTask } from '../../model/tasks/restore-and-import-task';

export const setTaskAction = (payload: any): BackupModalAction => {
  return {
    type: SET_TASK,
    payload,
  };
};

export const setBackupLocationsAction = (payload: any[]): BackupModalAction => {
  return {
    type: SET_BACKUP_LOCATIONS,
    payload,
  };
};

export const setHypervisoManagersAction = (
  payload: any[],
): BackupModalAction => {
  return {
    type: SET_HYPERVISOR_MANAGERS,
    payload,
  };
};

export const setHypervisorStoragesAction = (
  payload: any[],
): BackupModalAction => {
  return {
    type: SET_HYPERVISOR_STORAGES,
    payload,
  };
};

export const setFilteredHypervisorStoragesAction = (
  payload: any[],
): BackupModalAction => {
  return {
    type: SET_FILTERED_HYPERVISOR_STORAGES,
    payload,
  };
};

export const setHypervisorClustersAction = (
  payload: any[],
): BackupModalAction => {
  return {
    type: SET_HYPERVISOR_CLUSTERS,
    payload,
  };
};

export const getBackupLocations =
  (virtualMachine: any) => async (dispatch: Dispatch) => {
    const backupLocations = await backupsService.getBackupLocations(
      virtualMachine.guid,
    );
    await dispatch(setBackupLocationsAction(backupLocations));

    if (!backupLocations.length) {
      alertService.error(
        'There are no restorable backups for this virtual environment',
      );
      await dispatch(hideModalAction());
      return;
    }
    await getHypervisorManagersAvailableForBackupBackupLocation(
      backupLocations[0],
      virtualMachine,
    )(dispatch);
  };

export const getHypervisorManagersAvailableForBackupBackupLocation =
  (backupLocation: any, virtualMachine: any) => async (dispatch: Dispatch) => {
    const backupDetails = await backupsService.getBackup(
      backupLocation?.backup?.guid,
    );

    const hypervisorManagers =
      await backupsService.getHypervisorManagersAvailableForBackup(
        backupDetails.guid,
      );

    if (hypervisorManagers.length === 0) {
      return;
    }
    await dispatch(setHypervisoManagersAction(hypervisorManagers));
    const hypervisorInArray = hypervisorManagers?.find(
      (el) => el.guid === virtualMachine.hvManager.guid,
    );
    const hypervisorManager = hypervisorInArray || hypervisorManagers[0];
    await dispatch(
      setTaskAction({
        ...new RestoreAndImportTask(backupDetails.networkInterfaceCards),
        hypervisorManager,
      }),
    );

    const hypervisorClusters =
      await hypervisorsService.getHypervisorClustersForHvm(
        hypervisorManager.guid,
      );
    await dispatch(setHypervisorClustersAction(hypervisorClusters));

    const hypervisorStorages =
      await hypervisorsService.getHypervisorStoragesForHvm(
        hypervisorManager.guid,
      );
    await dispatch(setHypervisorStoragesAction(hypervisorStorages));
  };

export const getHypervisorStoragesForHypervisorManager =
  (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const hypervisorStorages =
      await hypervisorsService.getHypervisorStoragesForHvm(
        hypervisorManagerGuid,
      );
    await dispatch(setHypervisorStoragesAction(hypervisorStorages));
  };

export const getHypervisorClustersForHypervisorManager =
  (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const hypervisorClusters =
      await hypervisorsService.getHypervisorClustersForHvm(
        hypervisorManagerGuid,
      );
    await dispatch(setHypervisorClustersAction(hypervisorClusters));
  };

export const submitTask = (task) => async (dispatch: Dispatch) => {
  try {
    await tasksService.submitTaskRestoreAndImportWithProjectAssign(task);
    alertService.info('Restore task has been submitted');
    await dispatch(hideModalAction());
  } catch (e) {
    await dispatch(unsaveModalAction());
  }
};
