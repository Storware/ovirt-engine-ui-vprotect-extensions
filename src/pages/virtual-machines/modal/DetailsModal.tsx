import React, { useState } from 'react';
import InputText from 'components/input/Text';
import { Button } from 'primereact/button';
import { backupsService } from 'services/backups-service';
import Table from 'components/table/primereactTable';
import { Column } from 'primereact/column';
import { sizeTemplate } from 'components/table/templates';
import { DateShow } from 'components/convert/Date';

interface Props {
  fileSystems: any[];
  files: any[];
  backup: any;
}

export const DetailsModal = ({
  fileSystems,
  files,
  backup: { description, guid },
}: Props) => {
  const [descriptionValue, setDescription] = useState<string>(description);

  const updateDescription = () => {
    backupsService.updateBackupDescription(guid, descriptionValue);
  };

  return (
    <>
      <div className="d-flex flex-column">
        <InputText
          label="Description"
          inputValue={descriptionValue}
          change={({ value }) => {
            setDescription(value);
          }}
          className="w-100"
        />
        <Button
          onClick={updateDescription}
          className="p-button-outlined ml-auto mt-2"
          label="Save"
        />
      </div>

      <Table value={fileSystems} header="FILE SYSTEMS">
        <Column header="Volume" field="volume" />
        <Column header="Size" field="size" body={sizeTemplate} />
        <Column header="Type" field="type" />
        <Column header="Label" field="label" />
      </Table>

      <Table value={files} header="FILES">
        <Column
          header="Time"
          field="time"
          body={({ backupTime }) => <DateShow date={backupTime} />}
        />
        <Column header="Path" field="path" />
        <Column header="Size" field="size" body={sizeTemplate} />
      </Table>
    </>
  );
};
