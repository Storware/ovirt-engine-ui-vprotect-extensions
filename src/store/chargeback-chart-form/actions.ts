import { Dispatch } from 'redux';
import {
  ChargebackChartFormAction,
  SET_PROPERTY_OPTIONS,
} from 'store/chargeback-chart-form/types';
import { policiesService } from 'services/policies-service';
import { hypervisorsService } from 'services/hypervisors-service';
import { virtualMachinesService } from 'services/virtual-machines-service';
import { backupDestinationsService } from 'services/backup-destinations-service';

export const setPropertyOptions = (
  payload: any,
): ChargebackChartFormAction => ({
  type: SET_PROPERTY_OPTIONS,
  payload,
});

const getFilterEntitiesOptionsMethod = {
  backupDestinationGuids: backupDestinationsService.getBackupDestinationsPage,
  backupPolicyGuids: policiesService.getVmBackuptPoliciesPage,
  hypervisorClusterGuids: hypervisorsService.getHypervisorClustersPage,
  hypervisorManagerGuids: hypervisorsService.getHypervisorManagersPage,
  hypervisorGuids: hypervisorsService.getHypervisorsPage,
  virtualMachineGuids: virtualMachinesService.getVirtualMachinesPage,
};

export const getPropertyOptions =
  (property: string, propertyOptions, params) => async (dispatch: Dispatch) => {
    const apiResult = await getFilterEntitiesOptionsMethod[property](params);
    await dispatch(
      setPropertyOptions({
        ...propertyOptions,
        [property]: apiResult.body,
        [property + 'Total']: apiResult.totalCount,
      }),
    );
  };
