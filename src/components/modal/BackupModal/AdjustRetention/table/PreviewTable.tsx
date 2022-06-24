import Table from 'components/table/primereactTable';
import { Column } from 'primereact/column';
import React from 'react';
import { DestinationTemplate } from 'components/modal/BackupModal/AdjustRetention/table/templates';
import Select from 'components/input/Select';
import { RetentionHintsWithDescription } from 'model/retention-hints';
import { Calendar } from 'primereact/calendar';

const TypeSection = ({ element }) =>
  element.previousType?.name !== element.type?.name ? (
    <div className="d-flex align-items-center w-100">
      {element.previousType?.description}
      <i className="pi pi-arrow-right mx-5"></i>
      {element.type?.description}
    </div>
  ) : (
    <>{element.type?.description}</>
  );
const InputSections = ({ element }) => {
  const retentionHintsWithDescription = [
    ...RetentionHintsWithDescription,
    { name: 'RECREATE', description: 'label.recreate' },
  ];
  return (
    <div className="d-flex align-items-center">
      <div>
        <Select
          value={element.previousHint.name}
          options={retentionHintsWithDescription}
          dataKey="description"
          optionValue="name"
          optionLabel="description"
          label="Retention"
          disabled={true}
          required={true}
          className="w-100"
        />
        {element.previousArchiveExpire && (
          <Calendar
            value={new Date(element.previousArchiveExpire)}
            disabled={true}
            className="w-100"
          />
        )}
      </div>
      <i className="pi pi-arrow-right"></i>
      <div>
        <Select
          value={element.retentionHint.name}
          options={retentionHintsWithDescription}
          dataKey="description"
          optionValue="name"
          optionLabel="description"
          label="Retention"
          disabled={true}
          required={true}
          className="w-100"
        />
        <Calendar
          value={new Date(element.archiveExpire)}
          disabled={true}
          className="w-100"
        />
      </div>
    </div>
  );
};
export const PreviewTable = ({ value }) => {
  const operationTemplate = (element) => (
    <div
      className={`d-flex w-100 justify-content-between ${
        element.previousType?.name === element.type?.name &&
        'align-items-center'
      }`}
    >
      <TypeSection element={element} />
      <InputSections element={element} />
    </div>
  );
  return (
    <Table value={value}>
      <Column header="Name" field="backup.name" />
      <Column header="Backup Destination" body={DestinationTemplate} />
      <Column header="Operation" body={operationTemplate} />
    </Table>
  );
};
