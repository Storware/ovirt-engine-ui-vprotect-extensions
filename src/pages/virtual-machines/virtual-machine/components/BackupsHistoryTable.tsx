import React from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
  backupLocationsTemplates,
} from '../../../../components/table/templates';
import { useSelector } from 'react-redux';
import { selectBackupsHistory } from '../../../../store/virtual-machine/selectors';
import Table from '../../../../components/table/primereactTable';
import { Button } from 'primereact/button';
import { backupsService } from '../../../../services/backups-service';

const BackupsHistoryTable = ({ onRefresh }) => {
  const backupsHistory = useSelector(selectBackupsHistory);

  const markBackupWarningsAsKnowledged = (guid) => {
    backupsService.markBackupWarningsAsKnowledged(guid);
    onRefresh();
  };

  const warningIconTemplate = (rowData) => {
    return (
      !!rowData?.warnings.length && (
        <Button
          id={rowData.guid}
          icon="pi pi-exclamation-triangle"
          className={`p-button-rounded p-button-text`}
          onClick={() => markBackupWarningsAsKnowledged(rowData.guid)}
          tooltip={rowData.warnings.join(', ')}
          tooltipOptions={{ position: 'top', className: 'text-center' }}
          style={{
            color: rowData.warningsAcknowledged ? '#b1b1b1' : '#ffb236',
          }}
        />
      )
    );
  };

  return (
    <div>
      <Table value={backupsHistory}>
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

export default BackupsHistoryTable;
