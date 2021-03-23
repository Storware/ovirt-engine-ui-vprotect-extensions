import { Dispatch } from 'redux';
import dashboardService from 'services/dashboard-service';
import {
  ChargebackChartFormAction,
  SET_OPTIONS,
} from 'store/chargeback-chart-form/types';
import { setChargebackData } from 'store/chargeback-chart/actions';

export const setOptions = (payload: any): ChargebackChartFormAction => {
  return {
    type: SET_OPTIONS,
    payload,
  };
};

// private getFilterEntitiesOptionsMethod = {
//   backupDestinationGuids: this.backupDestinationService.getAllBackupDestinations(),
//   backupPolicyGuids: this.policiesService.queryPolicies(this.getPolicyType()),
//   hypervisorClusterGuids: this.hypervisorService.getAllHypervisorClusters(),
//   hypervisorManagerGuids: this.hypervisorManagerService.getAllHypervisorManagers(),
//   hypervisorGuids: this.hypervisorService.getAllHypervisors(),
//   virtualMachineGuids: this.virtualMachineService.getAllVirtualMachines(),
// };

export const getChargeBackData = (property: string) => async (
  dispatch: Dispatch,
) => {
  const chartData = await dashboardService.getChargeBackReport();

  await dispatch(
    setChargebackData({
      labels: chartData.map((el) => el.name),
      datasets: [
        {
          data: chartData.map((el) => el.size),
          label: 'Size',
        },
      ],
    }),
  );
};
