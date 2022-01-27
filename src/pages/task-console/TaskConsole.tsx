import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'patternfly-react';
import { vprotectService } from '../../services/vprotect-service';
import { alertService } from '../../services/alert-service';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { dateTemplate } from 'components/table/templates';
import { durationTemplate } from 'components/table/templates';
import { Button } from 'primereact/button';
import Table from 'components/table/primereactTable';

export default () => {
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);

  const getAllTasks = async () => {
    setRows(await vprotectService.getAllTasks());
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const header = () => {
    return (
      <div>
        <div className="d-flex justify-content-between mt-2">
          <div className="p-datatable-globalfilter-container">
            <InputText
              type="search"
              // @ts-ignore
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global Search"
            />
          </div>
          <div>
            <Button onClick={() => getAllTasks()} label="Refresh" />
            <Button
              className="ml-2"
              label="Delete all finished and queued tasks"
              onClick={async () => {
                await vprotectService.deleteQueuedOrFinishedTasks();
                await getAllTasks();
              }}
            />
            <Button
              className="ml-2"
              label="Remove all finished tasks"
              onClick={async () => {
                await vprotectService.deleteFinishedTasks();
                await getAllTasks();
              }}
            />

            <Button
              className="ml-2"
              label="Cancel all running tasks"
              onClick={async () => {
                await vprotectService.cancelRunningTasks();
                await getAllTasks();
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Table value={rows} header={header()} globalFilter={globalFilter}>
          <Column field="state.description" header="State" />
          <Column
            field="progress"
            header="Progress"
            body={(rowData) => (
              <ProgressBar
                now={rowData.progress}
                label={
                  <span className={'text-center'}>
                    {rowData.progress > 20 ? `${rowData.progress} %` : ''}
                  </span>
                }
              />
            )}
          />
          <Column field="type.description" header="Type" />
          <Column field="hypervisorManager.name" header="Hypervisor" />
          <Column field="protectedEntity.name" header="Virtual Machine" />
          <Column field="node.name" header="Node" />
          <Column field="backupDestination.name" header="Backup destination" />
          <Column field="priority" header="Priority" />
          <Column
            field="duration"
            header="Duration"
            body={durationTemplate}
          />
          <Column
            field="windowStart"
            header="Window start"
            body={dateTemplate}
          />
          <Column field="windowEnd" header="Window end" body={dateTemplate} />
          <Column
            field="action"
            header="Action"
            body={(rowData) => (
              <Button
                label="Remove"
                onClick={async () => {
                  if (rowData.state.name === 'RUNNING') {
                    const cancelledStatus = {
                      state: { name: 'CANCELLED' },
                      statusInfo: 'Canceled by user',
                    };

                    await vprotectService.cancelTask(
                      rowData.guid,
                      cancelledStatus,
                    );
                    alertService.info('alerts.taskHasBeenCancelled');
                  } else {
                    await vprotectService.deleteOrCancelTask(rowData.guid);
                    alertService.info('alerts.taskHasBeenDeleted');
                  }
                  getAllTasks();
                }}
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
};
