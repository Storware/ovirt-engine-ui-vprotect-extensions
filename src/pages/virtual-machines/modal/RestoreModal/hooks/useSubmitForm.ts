import { VirtualEnvironment } from 'types/virtual-environment';
import {
  RestoreAndImportTaskRequestDTO,
  RestoreModalContextType,
} from '../types';
import { submitTask } from 'store/restore-modal/actions';
import { useDispatch } from 'react-redux';
import { useModal } from './useModal';

export const useSubmitForm = ({
  virtualEnvironment,
}: {
  virtualEnvironment: VirtualEnvironment;
}) => {
  const { hideModal } = useModal();
  const dispatch = useDispatch();

  const submitForm: RestoreModalContextType['submitForm'] = (
    values,
    { setSubmitting },
  ) => {
    const restoreVmFlavor = values.isFlavorSectionActive
      ? values.restoreVmFlavor
      : virtualEnvironment.vmFlavor;

    const taskToSubmit: RestoreAndImportTaskRequestDTO = {
      backup: values.backupLocation.backup,
      backupLocation: values.backupLocation,
      hypervisorManager: values.hypervisorManager,
      restoreClusterId: values.restoreClusterId,
      restoredPeName: values.restoredPeName || null,
      taskFiles: values.taskFiles,
      overwrite: values.overwrite,
      restoreVmFlavor,
      restoredNetworks: values.restoredNetworks.map((restoredNetworkForm) => ({
        network: {
          guid: restoredNetworkForm.networkGuid,
        },
        networkInterfaceCard: {
          guid: restoredNetworkForm.guid,
          name: restoredNetworkForm.name,
        },
        securityGroups: restoredNetworkForm.securityGroupGuids,
        macAddress: restoredNetworkForm.macAddressSpecified
          ? restoredNetworkForm.macAddress
          : null,
        macAddressSpecified: restoredNetworkForm.macAddressSpecified,
      })),
    };

    dispatch(submitTask(taskToSubmit));
    setSubmitting(false);
    hideModal();
  };

  return { submitForm };
};
