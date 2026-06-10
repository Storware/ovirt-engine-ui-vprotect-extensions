import ToggleText from 'components/input/reactive/ToggleText';
import Select from 'components/input/reactive/Select';
import { Field } from 'formik';
import React from 'react';
import { vprotectService } from 'services/vprotect-service';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import { useRestoreModal } from './hooks/useRestoreModal';

export const GeneralTab = () => {
  const {
    backupLocations,
    hypervisorManagers,
    clusters,

    onBackupLocationChange,
    onHypervisorChange,
    onClusterChange,
  } = useRestoreModal();

  return (
    <>
      <Field
        name="backupLocation"
        component={Select}
        label="Backup location to restore"
        optionLabel="name"
        onChange={({ value }) => onBackupLocationChange(value)}
        required
        options={backupLocations}
      />
      <Field
        name="hypervisorManager"
        component={Select}
        onChange={onHypervisorChange}
        optionLabel="url"
        label="Hypervisor Manager"
        required
        disabled
        options={hypervisorManagers}
      />
      <Field
        name="restoreClusterId"
        component={Select}
        onChange={onClusterChange}
        valueProperty="uuid"
        optionLabel="name"
        required
        label={
          isNotOpenstackBuild ? 'Cluster' : 'Import to an availability zone'
        }
        options={clusters}
      />

      <Field
        name="restoredPeName"
        component={ToggleText}
        label="Specify name of the restored Virtual Environment"
        textLabel="Restored Virtual Environment name"
      />

      {isNotOpenstackBuild && (
        <Field
          name="restoredDiskAllocationFormat"
          component={Select}
          optionLabel="name"
          label="Disk allocation format"
          required
          options={vprotectService.diskAllocationFormats}
        />
      )}
    </>
  );
};
