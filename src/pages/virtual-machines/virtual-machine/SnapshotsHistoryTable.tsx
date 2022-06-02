import React from 'react';
import { useSelector } from 'react-redux';
import { selectSnapshotsHistory } from 'store/virtual-machine/selectors';
import Table from '../../../components/table/primereactTable';
import { Column } from 'primereact/column';
import { dateTemplate } from 'components/table/templates';

const SnapshotsHistoryTable = () => {
  const snapshotsHistory = useSelector(selectSnapshotsHistory);

  return (
    <div>
      <Table value={snapshotsHistory}>
        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column field="status" header="Status" />
        <Column field="policy" header="Policy" />
        <Column field="uuid" header="UUID" />
      </Table>
    </div>
  );
};

export default SnapshotsHistoryTable;
