import { PoliciesAction, SET_POLICIES } from './types';
import { Dispatch } from 'redux';
import { alertService } from '../../services/alert-service';
import { policiesService } from '../../services/policies-service';
import { SnapshotTask } from '../../model/tasks/snapshot-task';
import { TableParams } from 'components/table/primereactTable/TableParams';

export const setPolicies = (payload: any): PoliciesAction => ({
  type: SET_POLICIES,
  payload,
});

export const getPolicies = (type: string) => async (dispatch: Dispatch) => {
  const policies = await policiesService.getPolicies(type);
  await dispatch(setPolicies(policies));
};

export const getPoliciesPage =
  (type: string, params: Partial<TableParams>) =>
  async (dispatch: Dispatch) => {
    const policies = await policiesService.getPoliciesPage(type, params);
    await dispatch(setPolicies(policies));
  };

export const removePolicy =
  (type: string, guid: string) => async (dispatch: Dispatch) => {
    await policiesService.deletePolicy(type, guid);
    const policies = await policiesService.getPolicies(type);
    await dispatch(setPolicies(policies));
    alertService.info('Policy removed');
  };

export const snapshotPolicy =
  (type: string, policyListElement: any) => async (dispatch: Dispatch) => {
    const policy = await policiesService.getPolicy(
      type,
      policyListElement.guid,
    );
    const task = new SnapshotTask();
    task.protectedEntities = policy.vms;
    task.rule = policy.rules[0];
    await policiesService.submitTaskSnapshot(task);
    alertService.info('Snapshot task has been submitted');
  };
