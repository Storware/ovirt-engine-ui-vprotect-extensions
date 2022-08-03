import React from 'react';
import { Column } from 'primereact/column';
import { dateTemplate } from 'components/table/templates';
import { useSelector } from 'react-redux';
import { selectRestoresHistory } from 'store/virtual-machine/selectors';
import Table from 'components/table/primereactTable';
import { CalendarPropsModel } from 'model/time/calendarPropsModel';
import { Calendar } from 'primereact/calendar';

export default ({ date, setDate }: CalendarPropsModel) => {
  const restoresHistory = useSelector(selectRestoresHistory);
  const restoreTypes = {
    RESTORE: 'Restore',
    RESTORE_AND_IMPORT: 'Restore with import',
    RESTORE_AND_MOUNT: 'Restore with mount',
  };

  const TypeTemplate = ({ restoreType }) => (
    <>{restoreType ? restoreTypes[restoreType.name] : '-'}</>
  );

  return (
    <div>
      <Calendar
        id="range"
        value={date}
        onChange={({ value }) => setDate(value)}
        selectionMode="range"
        maxDate={new Date()}
        readOnlyInput
      />
      <Table value={restoresHistory}>
        <Column field="restoreTime" header="Restore time" body={dateTemplate} />
        <Column
          field="backup.snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column field="status.description" header="Status" />
        <Column field="statusInfo" header="Status info" />
        <Column field="type.description" header="Type" body={TypeTemplate} />
      </Table>
    </div>
  );
};
