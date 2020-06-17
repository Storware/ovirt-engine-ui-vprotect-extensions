import {
  SET_DISKS,
  SET_POLICIES,
  SET_SCHEDULES,
  SET_SNAPSHOT_POLICIES,
  SET_SNAPSHOTS,
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

export const setVirtualMachine = (payload: any): VirtualMachineAction => {
  return {
    type: SET_VIRTUAL_MACHINE,
    payload,
  };
};

export const setHypervisor = (payload: any): VirtualMachineAction => {
  return {
    type: SET_HYPERVISOR,
    payload,
  };
};

export const setBackupsHistory = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_BACKUPS_HISTORY,
    payload,
  };
};

export const setRestoresHistory = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_RESTORES_HISTORY,
    payload,
  };
};

export const setSnapshots = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_SNAPSHOTS,
    payload,
  };
};

export const setDisks = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_DISKS,
    payload,
  };
};

export const setSchedules = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_SCHEDULES,
    payload,
  };
};

export const setPolicies = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_POLICIES,
    payload,
  };
};

export const setSnapshotPolicies = (payload: any[]): VirtualMachineAction => {
  return {
    type: SET_SNAPSHOT_POLICIES,
    payload,
  };
};

export const getVirtualMachinePage = (guid) => async (dispatch: Dispatch) => {
  if (!guid) {
    return;
  }
  const virtualMachine = await virtualMachinesService.getVirtualMachine(guid);
  await dispatch(setVirtualMachine(virtualMachine));
  if (virtualMachine.hypervisor) {
    const hypervisor = await hypervisorsService.getHypervisor(
      virtualMachine.hypervisor.guid,
    );
    await dispatch(setHypervisor(hypervisor));
  }
  const backupsHistory = await backupsService.getProtectedEntityBackups(guid);
  await dispatch(setBackupsHistory(backupsHistory));
  const restoresHistory = await backupsService.getProtectedEntityRestoreJobs(
    guid,
  );
  await dispatch(setRestoresHistory(restoresHistory));
  let snapshots = await virtualMachinesService.getVirtualMachineSnapshots(guid);
  snapshots = setCurrentForIncrementalBackup(virtualMachine, snapshots);
  await dispatch(setSnapshots(snapshots));
  const disks = await virtualMachinesService.getVirtualMachineDisks(guid);
  await dispatch(setDisks(disks));
  const schedules = await schedulesService.getProtectedEntitySchedules(guid);
  await dispatch(setSchedules(schedules));
  const policies = await policiesService.getAllVmBackupPolicies(guid);
  await dispatch(setPolicies(policies));
  const snapshotPolicies = await policiesService.getAllSnapshotMgmtPolicies(
    guid,
  );
  await dispatch(setSnapshotPolicies(snapshotPolicies));
};

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
