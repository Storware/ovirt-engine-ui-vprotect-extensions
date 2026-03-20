import React, { useRef, useEffect, createContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaved } from 'store/modal/selectors';
import { setNetworkAction } from 'store/network/actions';
import {
  getHypervisorManagersAvailableForBackupBackupLocation,
  getBackupFiles,
  getHypervisorStoragesForHypervisorManager,
  getFlavorsForHypervisorManager,
} from 'store/restore-modal/actions';
import {
  selectHypervisorManagers,
  selectFilteredHypervisorStorages,
  selectFlavors,
  selectTask,
} from 'store/restore-modal/selectors';
import { VirtualEnvironment } from 'types/virtual-environment';
import { RestoreModalContextType, RestoreModalForm } from './types';
import { FormikProps } from 'formik';
import { useNetworkSettings } from './hooks/useNetworkSettings';
import { useClusters } from './hooks/useClusters';
import { useModal } from './hooks/useModal';
import { useVisibleTabs } from './hooks/useVisibleTabs';
import { useTaskFiles } from './hooks/useTaskFiles';
import { useSubmitForm } from './hooks/useSubmitForm';
import { useBackupLocations } from './hooks/useBackupLocations';
import { useNetworkList } from './hooks/useNetworkList';

export const RestoreModalContext = createContext<
  RestoreModalContextType | undefined
>(undefined);

interface RestoreModalProviderProps {
  children: ReactNode;
  virtualEnvironment: VirtualEnvironment;
}

export const RestoreModalProvider: React.FC<RestoreModalProviderProps> = ({
  children,
  virtualEnvironment,
}) => {
  const dispatch = useDispatch();
  const formRef = useRef<FormikProps<RestoreModalForm>>();
  const hypervisorManagers = useSelector(selectHypervisorManagers);
  const filteredStorages = useSelector(selectFilteredHypervisorStorages);
  const flavors = useSelector(selectFlavors);
  const task = useSelector(selectTask);
  const { hideModal, saveModal, hideFooter } = useModal();
  const form = formRef.current;
  const {
    clusterCopy,
    clusters,

    onClusterChange,
  } = useClusters();
  const { networkSettings, loadingNetworkSettings } = useNetworkSettings({
    form,
    virtualEnvironment,
  });
  const { visibleTabs, setVisibleTabs } = useVisibleTabs({
    loadingNetworkSettings,
  });
  const { backupLocations } = useBackupLocations({ virtualEnvironment });
  const { submitForm } = useSubmitForm({ virtualEnvironment });

  useEffect(() => {
    dispatch(setNetworkAction([]));
    hideFooter();
  }, []);

  useNetworkList();
  useTaskFiles({ form });

  const onBackupLocationChange = (value) => {
    dispatch(
      getHypervisorManagersAvailableForBackupBackupLocation(
        value,
        virtualEnvironment,
      ),
    );
    dispatch(getBackupFiles(value));
  };

  const onHypervisorChange = ({ value: { guid } }) => {
    dispatch(getHypervisorStoragesForHypervisorManager(guid));
    dispatch(getFlavorsForHypervisorManager(guid));
  };

  if (useSelector(selectSaved)) {
    formRef.current?.handleSubmit();
  }

  const formInitialValue: RestoreModalForm = {
    backupLocation: null,
    hypervisorManager: null,
    restoreClusterId: clusterCopy?.uuid || null,
    restoreToOriginalVolumeType: true,
    restoreVmFlavor: virtualEnvironment.vmFlavor,
    taskFiles: [],
    isFlavorSectionActive: task.isFlavorSectionActive || false,
    restoredPeName: '',
    overwrite: task.overwrite || false,
    restoredNetworks: [],
  };
  const contextValue: RestoreModalContextType = {
    formRef,
    backupLocations,
    hypervisorManagers,
    flavors,
    task,
    clusters,
    filteredStorages,
    virtualEnvironment,
    formInitialValue,
    loadingNetworkSettings,
    visibleTabs,
    networkSettings,

    onBackupLocationChange,
    onHypervisorChange,
    onClusterChange,
    submitForm,
    hideModal,
    saveModal,
    setVisibleTabs,
  };

  return (
    <RestoreModalContext.Provider value={contextValue}>
      {children}
    </RestoreModalContext.Provider>
  );
};
