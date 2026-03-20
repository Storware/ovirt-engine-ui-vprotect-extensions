import React from 'react';
import { useRestoreModal } from './hooks/useRestoreModal';
import { Field, useFormikContext } from 'formik';
import { RestoreModalForm } from './types';
import Toggle from 'components/input/reactive/Toggle';
import Table from 'components/table/primereactTable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import Select from 'components/input/Select';
import Text from 'components/input/Text';

export const StorageTab = () => {
  const { values, setFieldValue } = useFormikContext<RestoreModalForm>();
  const { filteredStorages } = useRestoreModal();
  const hvStorages = filteredStorages;
  const getElId = (element) =>
    values.taskFiles.findIndex(
      ({ originalDiskName }) => element.originalDiskName === originalDiskName,
    );

  return (
    <>
      {filteredStorages.length > 0 && (
        <>
          <Field
            name="restoreToOriginalVolumeType"
            component={Toggle}
            label="Restore volumes to original volume types"
          />

          {!values.restoreToOriginalVolumeType && (
            <>
              <Table
                value={values.taskFiles}
                rowClassName={({ excludedFromRestore }) => ({
                  'p-muted': excludedFromRestore,
                })}
              >
                <Column header="Disk name" field="originalDiskName" />
                <Column
                  header="Import to storage"
                  body={(row) => (
                    <div className="d-flex flex-column">
                      <Select
                        required
                        label="Import to storage*"
                        value={row.storageId}
                        disabled={row.excludedFromRestore}
                        options={hvStorages}
                        optionLabel="name"
                        optionValue="uuid"
                        onChange={({ value }) => {
                          void setFieldValue(
                            `taskFiles.${getElId(row)}.storageId`,
                            value,
                          );
                        }}
                      />

                      <Text
                        label="Disk Name*"
                        inputValue={row.diskName}
                        change={({ value }) =>
                          void setFieldValue(
                            `taskFiles.${getElId(row)}.diskName`,
                            value,
                          )
                        }
                        disabled={row.excludedFromRestore}
                        required
                      />
                    </div>
                  )}
                />
                <Column
                  header="Excluded from restore"
                  body={(row) => (
                    <Checkbox
                      checked={row.excludedFromRestore}
                      onChange={({ checked }) =>
                        void setFieldValue(
                          `taskFiles[${getElId(row)}].excludedFromRestore`,
                          checked,
                        )
                      }
                    />
                  )}
                />
              </Table>
            </>
          )}
        </>
      )}
    </>
  );
};
