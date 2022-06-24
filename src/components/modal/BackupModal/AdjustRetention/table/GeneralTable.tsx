import { Column } from 'primereact/column';
import Table from 'components/table/primereactTable';
import React from 'react';
import Select from 'components/input/Select';
import {
  RetentionHintKeys,
  RetentionHintKeysWithDescription,
  RetentionHintsWithDescription,
} from 'model/retention-hints';
import { Calendar } from 'primereact/calendar';
import { DestinationTemplate } from 'components/modal/BackupModal/AdjustRetention/table/templates';

export const GeneralTable = ({ value: val, setValue: setVal }) => {
  const getRowId = (row) => val.findIndex(({ guid }) => row.guid === guid);
  const setRetentionHint = (value, row) => {
    const newVal = [...val];
    newVal[getRowId(row)].retentionHint =
      RetentionHintKeysWithDescription[value];

    setVal(newVal);
  };

  const setArchiveExpire = (value, row) => {
    const newVal = [...val];
    newVal[getRowId(row)].archiveExpire = value;
    setVal(newVal);
  };
  const typeTemplate = ({ type }) => <>{type?.description}</>;

  const retentionTemplate = (row) => (
    <div className="d-flex flex-column">
      <Select
        value={row.retentionHint.name}
        options={RetentionHintsWithDescription}
        dataKey="description"
        optionValue="name"
        optionLabel="description"
        label="Retention *"
        onChange={({ value }) => setRetentionHint(value, row)}
        className="w-100"
      />
      {row.retentionHint.name === RetentionHintKeys.ARCHIVE && (
        <Calendar
          value={row.archiveExpire}
          onChange={({ value = new Date() }) => setArchiveExpire(value, row)}
          className="mt-2 w-100"
        />
      )}
    </div>
  );
  return (
    <Table value={val}>
      <Column header="Name" field="backup.name" />
      <Column header="Type" body={typeTemplate} />
      <Column header="Backup Destination" body={DestinationTemplate} />
      <Column header="Retention" body={retentionTemplate} />
    </Table>
  );
};
