import React from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
} from '../../../components/table/templates';
import { useDispatch, useSelector } from 'react-redux';
import { selectBackups } from '../../../store/virtual-machine/selectors';
import Table from 'components/table/primereactTable';
import { Calendar } from 'primereact/calendar';
import { CalendarPropsModel } from 'model/time/calendarPropsModel';
import { TableActionsTemplate } from 'pages/virtual-machines/virtual-machine/components/backups/TableActionsTemplate';

const BackupsTable = ({ date, setDate }: CalendarPropsModel) => {
  const dispatch = useDispatch();
  const backups = useSelector(selectBackups);

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
      <Table value={backups}>
        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
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

export default BackupsTable;
