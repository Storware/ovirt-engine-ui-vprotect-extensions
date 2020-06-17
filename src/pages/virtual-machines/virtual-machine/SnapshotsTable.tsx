import React from 'react';
import { Column } from 'primereact/column';
import {
  dateTemplate,
  booleanTemplate,
} from '../../../components/table/templates';
import { useSelector } from 'react-redux';
import { selectSnapshots } from '../../../store/virtual-machine/selectors';
import Table from '../../../components/table/primereactTable';

const SnapshotsTable = () => {
  let snapshots = useSelector(selectSnapshots);

  return (
    <div>
      <Table value={snapshots}>
        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column field="policy" header="Policy" />
        <Column field="uuid" header="UUID" />
        <Column
          field="current"
          header="Current for incremental backup"
          body={booleanTemplate}
        />
      </Table>
    </div>
  );
};

export default SnapshotsTable;
