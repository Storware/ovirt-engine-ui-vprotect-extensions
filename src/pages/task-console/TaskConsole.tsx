import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'patternfly-react';
import { vprotectService } from '../../services/vprotect-service';
import { alertService } from '../../services/alert-service';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { dateTemplate } from 'components/table/templates';
import { Button } from 'primereact/button';
import Table from 'components/table/primereactTable';
import { convertMilisecondsToHours } from 'utils/convertMilisecondsToHours';

export default () => {
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = async () => {
    const tasks = await vprotectService.getAllTasks();
    setRows(addDurationToTasks(tasks));
  };

  const addDurationToTasks = (tasks = []) => {
    return tasks.map((task) => {
      if (task.state.name !== 'RUNNING' && !task.startTime && task.finishTime) {
        return { ...task, duration: '00:00:00' };
      }

      if (task.state.name !== 'RUNNING' && task.startTime && task.finishTime) {
        return {
          ...task,
          duration: convertMilisecondsToHours(task.finishTime - task.startTime),
        };
      }

      if (task.state.name !== 'RUNNING') {
        return task;
      }

      return task;
    });
  };
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
          <Column
            field="backupType.description"
            header=""
            className="text-center"
          />
          <Column field="type.description" header="Type" />
          <Column field="hypervisorManager.name" header="Hypervisor" />
          <Column
            field="protectedEntity.name"
            header="Virtual Machine"
            body={(res) =>
              res.protectedEntity
                ? res.protectedEntity.name
                : res.protectedEntityDisplayName
            }
          />
          <Column field="node.name" header="Node" />
          <Column field="backupDestination.name" header="Backup destination" />
          <Column field="priority" header="Priority" />
          <Column field="duration" header="Duration" />
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
