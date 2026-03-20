import React from 'react';
import { Field, useFormikContext } from 'formik';
import Select from 'components/input/reactive/Select';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import { useRestoreModal } from './hooks/useRestoreModal';
import { RestoreModalForm } from './types';
import Toggle from 'components/input/reactive/Toggle';

export const AdvancedTab = () => {
  const { values } = useFormikContext<RestoreModalForm>();
  const { flavors } = useRestoreModal();

  return (
    <>
      <Field
        name="isFlavorSectionActive"
        component={(props) => <Toggle label="Select flavor" {...props} />}
      />

      {values.isFlavorSectionActive && (
        <Field
          name="restoreVmFlavor"
          component={Select}
          optionLabel="name"
          required
          label="Flavor"
          options={flavors}
        />
      )}

      <Field
        name="overwrite"
        component={Toggle}
        label={
          'Delete if virtual environment already exists' +
          (isNotOpenstackBuild
            ? ''
            : ' (all existing VMs with this name in target project)')
        }
      />
    </>
  );
};
