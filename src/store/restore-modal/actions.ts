import {
  BackupModalAction,
  SET_BACKUP_FILES,
  SET_BACKUP_LOCATIONS,
  SET_FILTERED_HYPERVISOR_STORAGES,
  SET_FLAVORS,
  SET_HYPERVISOR_CLUSTERS,
  SET_HYPERVISOR_MANAGERS,
  SET_HYPERVISOR_STORAGES,
  SET_TASK,
} from './types';
import { Dispatch } from 'redux';
import { backupsService } from 'services/backups-service';
import { tasksService } from 'services/tasks-service';
import { hypervisorsService } from 'services/hypervisors-service';
import { alertService } from 'services/alert-service';
import { hideModalAction, unsaveModalAction } from '../modal/actions';
import { RestoreAndImportTask } from 'model/tasks/restore-and-import-task';

export const setTaskAction = (payload: any): BackupModalAction => ({
  type: SET_TASK,
  payload,
});

export const setBackupLocationsAction = (
  payload: any[],
): BackupModalAction => ({
  type: SET_BACKUP_LOCATIONS,
  payload,
});

export const setHypervisorManagersAction = (
  payload: any[],
): BackupModalAction => ({
  type: SET_HYPERVISOR_MANAGERS,
  payload,
});

export const setHypervisorStoragesAction = (
  payload: any[],
): BackupModalAction => ({
  type: SET_HYPERVISOR_STORAGES,
  payload,
});

export const setFilteredHypervisorStoragesAction = (
  payload: any[],
): BackupModalAction => ({
  type: SET_FILTERED_HYPERVISOR_STORAGES,
  payload,
});

export const setHypervisorClustersAction = (
  payload: any[],
): BackupModalAction => ({
  type: SET_HYPERVISOR_CLUSTERS,
  payload,
});

export const setBackupFilesAction = (payload: any[]): BackupModalAction => ({
  type: SET_BACKUP_FILES,
  payload,
});

export const setHypervisorManagerFlavorsAction = (
  payload: any[],
): BackupModalAction => ({
  type: SET_FLAVORS,
  payload,
});

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

    const backupFiles = await backupsService.getBackupFilesDetailed(
      backupLocation?.backup?.guid,
    );

    const backupFilesFiltered = backupFiles.filter(
      (el) => el.hasOwnProperty('iscsiMountable') && el.iscsiMountable === true,
    );

    const hypervisorManagers =
      await backupsService.getHypervisorManagersAvailableForBackup(
        backupDetails.guid,
      );

    if (hypervisorManagers.length === 0) {
      return;
    }
    await dispatch(setHypervisorManagersAction(hypervisorManagers));
    const hypervisorInArray = hypervisorManagers?.find(
      ({ guid }) => guid === virtualMachine.hvManager.guid,
    );
    const hypervisorManager = hypervisorInArray || hypervisorManagers[0];
    await dispatch(
      setTaskAction({
        ...new RestoreAndImportTask(backupDetails.networkInterfaceCards),
        hypervisorManager,
        ...(backupFilesFiltered && { taskFiles: backupFiles }),
      }),
    );

    void hypervisorsService
      .getHypervisorClustersForHvm(hypervisorManager.guid)
      .then((hypervisorClusters) =>
        dispatch(setHypervisorClustersAction(hypervisorClusters)),
      );

    void hypervisorsService
      .getHypervisorStoragesForHvm(hypervisorManager.guid)
      .then((hypervisorStorages) =>
        dispatch(setHypervisorStoragesAction(hypervisorStorages)),
      );
  };

export const getHypervisorStoragesForHypervisorManager =
  (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const hypervisorStorages =
      await hypervisorsService.getHypervisorStoragesForHvm(
        hypervisorManagerGuid,
      );
    await dispatch(setHypervisorStoragesAction(hypervisorStorages));
  };

export const getFlavorsForHypervisorManager =
  (hypervisorManagerGuid: string) => async (dispatch: Dispatch) => {
    const flavors = await hypervisorsService.getFlavorsForHypervisorManager(
      hypervisorManagerGuid,
    );
    await dispatch(setHypervisorManagerFlavorsAction(flavors));
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

export const getBackupFiles =
  (backupLocation: any) => async (dispatch: Dispatch) => {
    const data = await backupsService.getBackupFilesDetailed(
      backupLocation?.backup?.guid,
    );

    const v = data.filter(
      (el) => el.hasOwnProperty('iscsiMountable') && el.iscsiMountable === true,
    );

    dispatch(setBackupFilesAction(data));
  };
