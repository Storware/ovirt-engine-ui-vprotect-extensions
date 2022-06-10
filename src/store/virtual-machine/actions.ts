import {
  SET_BACKUPS,
  SET_DISKS,
  SET_POLICIES,
  SET_SCHEDULES,
  SET_SNAPSHOT_POLICIES,
  SET_SNAPSHOTS,
  SET_SNAPSHOTS_HISTORY,
  VirtualMachineAction,
} from './types';
import { Dispatch } from 'redux';
import {
  SET_RESTORES_HISTORY,
  SET_BACKUPS_HISTORY,
  SET_HYPERVISOR,
  SET_VIRTUAL_MACHINE,
} from './types';
import { virtualMachinesService } from '../../services/virtual-machines-service';
import { hypervisorsService } from '../../services/hypervisors-service';
import { backupsService } from '../../services/backups-service';
import { schedulesService } from '../../services/schedules-service';
import { policiesService } from '../../services/policies-service';
import { DateRangeModel } from 'model/time/dateRange.model';

export const setVirtualMachine = (payload: any): VirtualMachineAction => ({
  type: SET_VIRTUAL_MACHINE,
  payload,
});

export const setHypervisor = (payload: any): VirtualMachineAction => ({
  type: SET_HYPERVISOR,
  payload,
});

export const setBackups = (payload: any[]): VirtualMachineAction => ({
  type: SET_BACKUPS,
  payload,
});

export const setBackupsHistory = (payload: any[]): VirtualMachineAction => ({
  type: SET_BACKUPS_HISTORY,
  payload,
});

export const setRestoresHistory = (payload: any[]): VirtualMachineAction => ({
  type: SET_RESTORES_HISTORY,
  payload,
});

export const setSnapshots = (payload: any[]): VirtualMachineAction => ({
  type: SET_SNAPSHOTS,
  payload,
});

export const setSnapshotsHistory = (payload: any[]): VirtualMachineAction => ({
  type: SET_SNAPSHOTS_HISTORY,
  payload,
});

export const setDisks = (payload: any[]): VirtualMachineAction => ({
  type: SET_DISKS,
  payload,
});

export const setSchedules = (payload: any[]): VirtualMachineAction => ({
  type: SET_SCHEDULES,
  payload,
});

export const setPolicies = (payload: any[]): VirtualMachineAction => ({
  type: SET_POLICIES,
  payload,
});

export const setSnapshotPolicies = (payload: any[]): VirtualMachineAction => ({
  type: SET_SNAPSHOT_POLICIES,
  payload,
});

const setCurrentForIncrementalBackup = (virtualMachine, snapshots) => {
  for (const snapshot of snapshots) {
    if (
      virtualMachine.lastStoredSnapshot != null &&
      snapshot.guid === virtualMachine.lastStoredSnapshot.guid
    ) {
      snapshot.current = true;
      break;
    }
  }
  return snapshots;
};
export const getVirtualMachineTabs =
  (guid: string, virtualMachine, date?: DateRangeModel) =>
  (dispatch: Dispatch) => {
    if (!guid) {
      return;
    }

    void backupsService
      .getProtectedEntityBackups(guid, {
        status: ['SUCCESS', 'PARTIAL_SUCCESS'],
        ...(date && { from: date.from, to: date.to }),
      })
      .then((backups) => dispatch(setBackups(backups)));

    void backupsService
      .getProtectedEntityBackups(guid, {
        ...(date && { from: date.from, to: date.to }),
      })
      .then((backupsHistory) => dispatch(setBackupsHistory(backupsHistory)));

    void backupsService
      .getProtectedEntityRestoreJobs(guid, {
        ...(date && { from: date.from, to: date.to }),
      })
      .then((restoresHistory) => dispatch(setRestoresHistory(restoresHistory)));

    void virtualMachinesService
      .getVirtualMachineSnapshots(guid)
      .then((snapshots) =>
        dispatch(
          setSnapshots(
            setCurrentForIncrementalBackup(virtualMachine, snapshots),
          ),
        ),
      );

    void virtualMachinesService
      .getVirtualMachineSnapshots(guid, true)
      .then((snapshotsHistory) =>
        dispatch(setSnapshotsHistory(snapshotsHistory)),
      );

    void virtualMachinesService
      .getVirtualMachineDisks(guid)
      .then((disks) => dispatch(setDisks(disks)));

    void schedulesService
      .getProtectedEntitySchedules(guid)
      .then((schedules) => dispatch(setSchedules(schedules)));
  };

export const getVirtualMachinePage =
  (guid: string, date?: DateRangeModel) => async (dispatch: Dispatch) => {
    if (!guid) {
      return;
    }

    const virtualMachine = await virtualMachinesService.getVirtualMachine(guid);
    await dispatch(setVirtualMachine(virtualMachine));

    if (virtualMachine.hypervisor) {
      void hypervisorsService
        .getHypervisor(virtualMachine.hypervisor.guid)
        .then((hypervisor) => dispatch(setHypervisor(hypervisor)));
    }

    getVirtualMachineTabs(guid, virtualMachine, date)(dispatch);

    void policiesService
      .getAllVmBackupPolicies(guid)
      .then((policies) => dispatch(setPolicies(policies)));

    void policiesService
      .getAllSnapshotMgmtPolicies(guid)
      .then((snapshotPolicies) =>
        dispatch(setSnapshotPolicies(snapshotPolicies)),
      );
  };
