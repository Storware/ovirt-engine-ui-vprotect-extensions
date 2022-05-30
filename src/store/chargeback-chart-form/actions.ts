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
  backupDestinationGuids: backupDestinationsService.getAllBackupDestinations,
  backupPolicyGuids: () => policiesService.getPolicies('vm-backup'),
  hypervisorClusterGuids: hypervisorsService.getAllHypervisorClusters,
  hypervisorManagerGuids: hypervisorsService.getAllHypervisorManagers,
  hypervisorGuids: hypervisorsService.getHypervisors,
  virtualMachineGuids: virtualMachinesService.getVirtualMachines,
};

export const getPropertyOptions = (property: string, propertyOptions) => async (
  dispatch: Dispatch,
) => {
  await dispatch(
    setPropertyOptions({
      ...propertyOptions,
      [property]: await getFilterEntitiesOptionsMethod[property](),
    }),
  );
};
