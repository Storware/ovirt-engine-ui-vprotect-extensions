import {
  BackupModalAction,
  SET_BACKUP_DESTINATIONS,
  SET_BACKUP_TYPES,
} from './types';
import { Dispatch } from 'redux';
import { backupDestinationsService } from '../../services/backup-destinations-service';
import { vprotectService } from '../../services/vprotect-service';
import { alertService } from '../../services/alert-service';
import { BackupTask } from '../../model/tasks/backup-task';
import { hideModalAction, unsaveModalAction } from '../modal/actions';

export const setBackupDestinationsAction = (
  payload: any[]
): BackupModalAction => {
  return {
    type: SET_BACKUP_DESTINATIONS,
    payload,
  };
};

export const setBackupTypesAction = (payload: any[]): BackupModalAction => {
  return {
    type: SET_BACKUP_TYPES,
    payload,
  };
};

export const getBackupDestinationsAndBackupTypes = (
  virtualEnvironments: any,
) => async (dispatch: Dispatch) => {
  const backupDestiantions = await backupDestinationsService.getBackupDestinationsForVMs(
    virtualEnvironments,
  );
  await dispatch(setBackupDestinationsAction(backupDestiantions));
  const backupTypes = vprotectService.getBackupTypes(virtualEnvironments[0]);
  await dispatch(setBackupTypesAction(backupTypes));
};

export const submitTask = (task: BackupTask) => async (dispatch: Dispatch) => {
  try {
    await vprotectService.submitExportTask(task);
    alertService.info('Backup task has been submitted');
    await dispatch(hideModalAction());
  } catch (e) {
    await dispatch(unsaveModalAction());
  }
};
