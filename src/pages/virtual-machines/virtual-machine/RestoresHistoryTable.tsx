import React from 'react';
import { Column } from 'primereact/column';
import { dateTemplate } from '../../../components/table/templates';
import { useSelector } from 'react-redux';
import { selectRestoresHistory } from '../../../store/virtual-machine/selectors';
import Table from '../../../components/table/primereactTable';

const RestoresHistoryTable = () => {
  let restoresHistory = useSelector(selectRestoresHistory);

  return (
    <div>
      <Table value={restoresHistory}>
        <Column field="restoreTime" header="Restore time" body={dateTemplate} />
        <Column
          field="backup.snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column field="status.description" header="Status" />
        <Column field="statusInfo" header="Status info" />
        <Column field="type.description" header="Type" />
      </Table>
    </div>
  );
};

export default RestoresHistoryTable;
