import {Dispatch} from 'redux';
import {SET_FILTERED_VIRTUAL_MACHINES, SET_VIRTUAL_MACHINES, VirtualMachinesAction} from './types';
import {virtualMachinesService} from '../../components/vprotect/services/virtual-machines-service';

export const setVirtualMachines = (payload: any): VirtualMachinesAction => {
    return {
        type: SET_VIRTUAL_MACHINES,
        payload
    };
};

export const setFilteredVirtualMachines = (payload: any): VirtualMachinesAction => {
    return {
        type: SET_FILTERED_VIRTUAL_MACHINES,
        payload
    };
};

export const getVirtualMachinesPage = async (dispatch: Dispatch) => {
    const virtualMachine = await virtualMachinesService.getVirtualMachines()
    await dispatch(setVirtualMachines(virtualMachine));
};
