import { Dispatch } from 'redux';
import { SET_POLICIES, SET_SCHEDULE, PolicyAction } from './types';
import { policiesService } from '../../services/policies-service';
import { schedulesService } from '../../services/schedules-service';
import { Schedule } from '../../model/schedule';

export const setScheduleAction = (payload: any): PolicyAction => ({
  type: SET_SCHEDULE,
  payload,
});

export const setPoliciesAction = (payload: any): PolicyAction => ({
  type: SET_POLICIES,
  payload,
});

const policyType = {
  VM_SNAPSHOT: 'vm-snapshot',
  VM_BACKUP: 'vm-backup',
};

export const getSchedulePage = (type: string, guid: string) => async (
  dispatch: Dispatch,
) => {
  const scheduele =
    guid === 'create'
      ? new Schedule(type)
      : await schedulesService.getSchedule(guid);
  await dispatch(setScheduleAction(scheduele));
  const policies = await policiesService.getPolicies(policyType[type]);
  await dispatch(setPoliciesAction(policies));
};

export const save = async (model: any) => {
  if (model.guid) {
    await schedulesService.updateSchedule(model.guid, model);
  } else {
    await schedulesService.createSchedule(model);
  }
};
