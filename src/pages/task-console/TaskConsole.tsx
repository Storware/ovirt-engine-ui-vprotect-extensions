import React, { useEffect, useState } from 'react';
import { vprotectService } from 'services/vprotect-service';
import { alertService } from 'services/alert-service';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { dateTemplate, originTemplate } from 'components/table/templates';
import { Button } from 'primereact/button';
import Table from 'components/table/primereactTable';
import { convertMilisecondsToHours } from 'utils/convertMilisecondsToHours';
import { WorkflowExecutionStates } from 'model/task-panel.model';
import { ProgressBar } from 'primereact/progressbar';

export default () => {
  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [busy, setBusy] = useState<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    getAllTasks();
    return () => {
      clearBusy();
    };
  }, []);

  const getAllTasks = async () => {
    clearBusy();
    const tasks = await vprotectService.getAllTasks();
    setRows(addDurationToTasks(tasks));
  };

  const clearBusy = () => {
    busy.filter(Boolean).forEach((interval) => {
      clearInterval(interval);
    });
    setBusy([]);
  };

  const addDurationToTasks = (tasks = []) =>
    tasks.map((task) => {
      if (
        task.state.name !== WorkflowExecutionStates.RUNNING &&
        !task.startTime &&
        task.finishTime
      ) {
        return { ...task, duration: '00:00:00' };
      }

      if (
        task.state.name !== WorkflowExecutionStates.RUNNING &&
        task.startTime &&
        task.finishTime
      ) {
        return {
          ...task,
          duration: convertMilisecondsToHours(task.finishTime - task.startTime),
        };
      }
      if (task.state.name !== WorkflowExecutionStates.RUNNING) {
        return task;
      }

      setTimeout(() => {
        const interval = setInterval(() => {
          task.duration = convertMilisecondsToHours(
            +new Date() - task.startTime,
          );
          setRows((t) => [...t]);
        }, 1000);
        setBusy((b) => [...b, interval]);
      }, 1000);

      return task;
    });
  const header = () => (
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

  return (
    <div>
      <div>
        <Table value={rows} header={header()} globalFilter={globalFilter}>
          <Column field="state.description" header="State" sortable />
          <Column
            sortable
            field="progress"
            header="Progress"
            body={({ progress }) => (
              <ProgressBar
                className="progress-bar-element"
                value={progress}
                showValue={true}
              />
            )}
          />
          <Column
            sortable
            field="backupType.description"
            header=""
            className="text-center"
          />
          <Column field="type.description" header="Type" sortable />
          <Column field="hypervisorManager.name" header="Hypervisor" sortable />
          <Column
            sortable
            field="protectedEntity.name"
            header="Virtual Machine"
            body={(res) =>
              res.protectedEntity
                ? res.protectedEntity.name
                : res.protectedEntityDisplayName
            }
          />
          <Column field="node.name" header="Node" sortable />
          <Column
            field="backupDestination.name"
            header="Backup destination"
            sortable
          />
          <Column header="Origin" body={originTemplate} sortable />
          <Column field="priority" header="Priority" sortable />
          <Column field="duration" header="Duration" sortable />
          <Column
            field="windowStart"
            header="Window start"
            body={dateTemplate}
            sortable
          />
          <Column
            field="windowEnd"
            header="Window end"
            body={dateTemplate}
            sortable
          />
          <Column
            field="action"
            header="Action"
            body={(rowData) => (
              <Button
                label="Remove"
                onClick={async () => {
                  if (rowData.state.name === WorkflowExecutionStates.RUNNING) {
                    const cancelledStatus = {
                      state: { name: 'CANCELLED' },
                      statusInfo: 'Canceled by user',
                    };

                    await vprotectService.cancelTask(
                      rowData.guid,
                      cancelledStatus,
                    );
                    alertService.info('Task has been cancelled');
                  } else {
                    await vprotectService.deleteOrCancelTask(rowData.guid);
                    alertService.info('Task has been deleted');
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
