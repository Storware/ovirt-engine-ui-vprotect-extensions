import { useEffect, useState } from 'react';
import { NetworkSettings, RestoreModalForm } from '../types';
import { FormikProps } from 'formik';
import { restoreSettingsService } from 'services/restore-settings-service';
import { VirtualEnvironment } from 'types/virtual-environment';

export const useNetworkSettings = ({
  form,
  virtualEnvironment,
}: {
  form?: FormikProps<RestoreModalForm>;
  virtualEnvironment: VirtualEnvironment;
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const [networkSettings, setNetworkSettings] = useState<NetworkSettings>(null);
  const [loadingNetworkSettings, setLoadingNetworkSettings] = useState(false);

  useEffect(() => {
    const backupLocation = form?.values?.backupLocation;

    if (!backupLocation || networkSettings !== null) {
      return;
    }

    setLoadingNetworkSettings(true);

    void restoreSettingsService
      .fetchRestoreSettings({
        hvmGuid: virtualEnvironment.hypervisor.hvManager.guid,
        backupGuid: backupLocation.backup.guid,
        projectGuid: isDevelopment
          ? virtualEnvironment.project.guid
          : undefined,
        clusterGuid: virtualEnvironment.hvCluster.guid,
      })
      .then(async (res) => {
        await form.setFieldValue(
          'restoredNetworks',
          res.networkSection.sourceNetworkWithSecurityGroups.map(
            (sourceNetwork) => ({
              guid: sourceNetwork.guid,
              name: sourceNetwork.name,
              networkGuid: sourceNetwork.defaultNetworkInternalId,
              securityGroupGuids: sourceNetwork.securityGroupsFromBackup.map(
                (sg) => sg.guid,
              ),
              macAddress: sourceNetwork.defaultMacAddress,
              macAddressSpecified: false,
            }),
          ),
        );

        setNetworkSettings(res.networkSection);
        setLoadingNetworkSettings(false);
      });
  }, [form?.values?.backupLocation, virtualEnvironment]);

  return {
    loadingNetworkSettings,
    networkSettings,
  };
};
