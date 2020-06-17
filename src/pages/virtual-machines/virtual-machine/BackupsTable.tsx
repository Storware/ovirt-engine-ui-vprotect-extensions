import React from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
} from '../../../components/table/templates';
import { useSelector } from 'react-redux';
import { selectBackupsHistory } from '../../../store/virtual-machine/selectors';
import Table from 'components/table/primereactTable';

const BackupsTable = () => {
  let backupsHistory = useSelector(selectBackupsHistory);

  return (
    <div>
      <Table value={backupsHistory}>
        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column field="statusInfo" header="Status info" />
        <Column field="type.description" header="Type" />
        <Column field="size" header="Size" body={sizeTemplate} />
      </Table>
    </div>
  );
};

export default BackupsTable;
