import React from 'react';
import Table from 'components/table/primereactTable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import Text from '../../../../components/input/Text';
import Select from 'components/input/Select';

interface Props {
  data: any[];
  setFieldValue?: (field: string, value: unknown) => void;
  hvStorages: any;
}

const SelectStoragesWithDiskName = ({
  data,
  setFieldValue,
  hvStorages,
}: Props) => {
  const getElId = (element) =>
    data.findIndex(
      ({ originalDiskName }) => element.originalDiskName === originalDiskName,
    );

  const ImportToStorageBody = (row) => {
    if (!row.storageId) {
      row.storageId =
        hvStorages.find(
          (hvStorage) =>
            hvStorage.guid === row.backupFile?.vmDisk?.originalStorage?.guid,
        )?.uuid ?? hvStorages[0].uuid;
    }
    const id = getElId(row);
    return (
      <div className="d-flex flex-column">
        <Select
          required
          label="Import to storage*"
          value={row.storageId}
          disabled={row.excludedFromRestore}
          options={hvStorages}
          optionLabel="name"
          optionValue="uuid"
          onChange={({ value }) =>
            setFieldValue(`taskFiles[${id}].storageId`, value)
          }
        />

        <Text
          label="Disk Name*"
          inputValue={row.diskName}
          change={({ value }) =>
            setFieldValue(`taskFiles[${id}].diskName`, value)
          }
          disabled={row.excludedFromRestore}
          required
        />
      </div>
    );
  };

  const ExcludedFromRestore = (row) => {
    const id = getElId(row);

    return (
      <Checkbox
        checked={row.excludedFromRestore}
        onChange={({ checked }) =>
          setFieldValue(`taskFiles[${id}].excludedFromRestore`, checked)
        }
      />
    );
  };

  return (
    <>
      <Table
        value={data}
        rowClassName={({ excludedFromRestore }) => ({
          'p-muted': excludedFromRestore,
        })}
      >
        <Column header="Disk name" field="originalDiskName" />
        <Column header="Import to storage" body={ImportToStorageBody} />
        <Column header="Excluded from restore" body={ExcludedFromRestore} />
      </Table>
    </>
  );
};

export default SelectStoragesWithDiskName;
