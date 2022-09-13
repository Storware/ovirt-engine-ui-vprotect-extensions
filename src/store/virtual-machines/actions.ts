import { Dispatch } from 'redux';
import { SET_VIRTUAL_MACHINES, VirtualMachinesAction } from './types';
import { virtualMachinesService } from '../../services/virtual-machines-service';
import { tasksService } from '../../services/tasks-service';
import { alertService } from '../../services/alert-service';
import { TableParams } from 'components/table/primereactTable/TableParams';
import { getElementWithoutProjectUuidInName } from 'utils/byProjectFilter';

export const setVirtualMachines = (payload: any): VirtualMachinesAction => ({
  type: SET_VIRTUAL_MACHINES,
  payload,
});

export const getVirtualMachines = async (dispatch: Dispatch) => {
  const virtualMachine = await virtualMachinesService.getVirtualMachines();
  await dispatch(setVirtualMachines(virtualMachine));
};

export const getVirtualMachinesPage =
  (params: Partial<TableParams>) => async (dispatch: Dispatch) => {
    const virtualMachine = await virtualMachinesService.getVirtualMachinesPage(
      params,
    );

    console.log('action', virtualMachine);
    await dispatch(setVirtualMachines(virtualMachine));
  };

export const deleteVirtualMachine =
  (virtualMachine) => async (dispatch: Dispatch) => {
    const res = await tasksService.submitTaskDelete(virtualMachine.guid);
    if (res.length) {
      alertService.info('Delete task has been submitted');
    } else {
      await getVirtualMachines(dispatch);
      alertService.info('Virtual environment has been deleted');
    }
  };
