import React, { useState } from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
  backupLocationsTemplates,
  originTemplate,
} from 'components/table/templates';
import { useSelector } from 'react-redux';
import { selectBackupsHistory } from 'store/virtual-machine/selectors';
import Table from 'components/table/primereactTable';
import { Button } from 'primereact/button';
import { backupsService } from '../../../../services/backups-service';
import { CalendarPropsModel } from 'model/time/calendarPropsModel';
import { Calendar } from 'primereact/calendar';
import { AdjustRetention } from 'pages/virtual-machines/virtual-machine/components/AdjustRetention';

interface Props extends CalendarPropsModel {
  onRefresh: () => void;
}

export default ({ onRefresh, date, setDate }: Props) => {
  const backupsHistory = useSelector(selectBackupsHistory);
  const [selected, setSelected] = useState([]);
  const markBackupWarningsAsKnowledged = (guid) => {
    backupsService.markBackupWarningsAsKnowledged(guid);
    onRefresh();
  };

  const warningIconTemplate = (rowData) =>
    !!rowData?.warnings.length && (
      <Button
        id={rowData.guid}
        icon="pi pi-exclamation-triangle"
        className={'p-button-rounded p-button-text'}
        onClick={() => markBackupWarningsAsKnowledged(rowData.guid)}
        tooltip={rowData.warnings.join(', ')}
        tooltipOptions={{ position: 'top', className: 'text-center' }}
        style={{
          color: rowData.warningsAcknowledged ? '#b1b1b1' : '#ffb236',
        }}
      />
    );

  return (
    <div>
      <AdjustRetention
        disabled={selected.length === 0}
        data={selected.map(
          ({ backupLocations: [backupLocation] }) => backupLocation,
        )}
        onSave={() => {
          setSelected([]);
          onRefresh();
        }}
      />
      <Calendar
        id="range"
        value={date}
        onChange={({ value }) => setDate(value)}
        selectionMode="range"
        maxDate={new Date()}
        readOnlyInput
      />
      <Table
        value={backupsHistory}
        selectionMode="checkbox"
        selection={selected}
        onSelectionChange={({ value }) => setSelected(value)}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column
          field="warnings"
          header=""
          body={warningIconTemplate}
          style={{ width: '64px' }}
        />
        <Column field="status.description" header="Status" />
        <Column
          field="backupLocations"
          header="Locations"
          body={backupLocationsTemplates}
        />
        <Column header="Origin" body={originTemplate} />

        <Column field="statusInfo" header="Status info" />
        <Column
          field="type.description"
          header="Type"
          style={{ width: '120px' }}
        />
        <Column
          field="size"
          header="Size"
          body={sizeTemplate}
          style={{ width: '100px' }}
        />
      </Table>
    </div>
  );
};
