import React from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  booleanTemplate,
} from '../../../components/table/templates';
import { useSelector } from 'react-redux';
import { selectDisks } from '../../../store/virtual-machine/selectors';
import Table from '../../../components/table/primereactTable';

const DisksTable = () => {
  let disks = useSelector(selectDisks);

  return (
    <div>
      <Table value={disks}>
        <Column field="name" header="Name" />
        <Column field="uuid" header="UUID" />
        <Column field="size" header="Size date" body={sizeTemplate} />
        <Column field="present" header="Present" body={booleanTemplate} />
        <Column
          field="excludedFromBackup"
          header="Excluded from backup"
          body={booleanTemplate}
        />
      </Table>
    </div>
  );
};

export default DisksTable;
