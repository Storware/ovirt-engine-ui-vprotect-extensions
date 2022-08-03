import React, { useState } from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
  originTemplate,
  backupLocationsTemplates,
} from 'components/table/templates';
import { useDispatch, useSelector } from 'react-redux';
import { selectBackups } from 'store/virtual-machine/selectors';
import Table from 'components/table/primereactTable';
import { Calendar } from 'primereact/calendar';
import { CalendarPropsModel } from 'model/time/calendarPropsModel';
import { AdjustRetention } from 'pages/virtual-machines/virtual-machine/components/AdjustRetention';
import { TableActionsTemplate } from 'pages/virtual-machines/virtual-machine/components/backups/TableActionsTemplate';
import { Button } from 'primereact/button';

export default ({
  date,
  setDate,
  onRefresh,
}: { onRefresh: () => void } & CalendarPropsModel) => {
  const dispatch = useDispatch();
  const backups = useSelector(selectBackups);
  const [selected, setSelected] = useState([]);
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
        value={backups}
        selectionMode="checkbox"
        selection={selected}
        onSelectionChange={({ value }) => setSelected(value)}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em' }}
        ></Column>

        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={(rowData, column) => (
            <>
              {dateTemplate(rowData, column)}
              {rowData.description && (
                <Button
                  icon="pi pi-info"
                  className="p-button-rounded p-button-sm p-button-text ml-2"
                  tooltip={rowData.description}
                  tooltipOptions={{ position: 'top' }}
                  style={{ height: '24px', width: '24px' }}
                />
              )}
            </>
          )}
        />
        <Column
          field="backupLocations"
          header="Locations"
          body={backupLocationsTemplates}
        />
        <Column header="Origin" body={originTemplate} />
        <Column field="statusInfo" header="Status info" />
        <Column field="type.description" header="Type" />
        <Column field="size" header="Size" body={sizeTemplate} />
        <Column
          body={(data) => TableActionsTemplate(data, dispatch)}
          style={{ width: '10%' }}
        />
      </Table>
    </div>
  );
};
