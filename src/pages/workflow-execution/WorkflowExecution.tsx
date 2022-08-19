import React, { useEffect, useState } from 'react';
import { vprotectService } from '../../services/vprotect-service';
import { Column } from 'primereact/column';
import { VirtualScrollTable } from 'components/table/VirtualScrollTable';
import { convertMilisecondsToHours } from 'utils/convertMilisecondsToHours';
import { originTemplate } from 'components/table/templates';
import { Header } from './components/Header';
import { Button } from 'primereact/button';
import { ExpandedWorkflowExecutionTable } from 'pages/workflow-execution/components/ExpandedWorkflowExecutionTable';
import { WorkflowExecutionStates } from 'model/task-panel.model';
import { Tooltip } from 'primereact/tooltip';

export const WorkflowExecution = () => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [workflowExecutionData, setWorkflowExecutionData] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRowsData, setExpandedRowsData] = useState({});
  const ITEMS_LOAD = 40;
  const [busy, setBusy] = useState<ReturnType<typeof setTimeout>[]>([]);

  const clearBusy = () => {
    busy.filter(Boolean).forEach((interval) => {
      clearInterval(interval);
    });
    setBusy([]);
  };

  const addDurationToTasks = (tasks = [], setRows) =>
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
  const getWorkflowExecutionData = async () => {
    clearBusy();
    const data = await vprotectService.getWorkflowExecution(
      page,
      ITEMS_LOAD,
      globalFilter,
    );
    setPage((_page) => _page + 1);
    setWorkflowExecutionData(
      addDurationToTasks(
        [...workflowExecutionData, ...data],
        setWorkflowExecutionData,
      ),
    );
  };

  const getTaskWorkflowExecutionData = async (guid) => {
    const data = await vprotectService.getTaskWorkflowExecution(guid);
    setExpandedRowsData((prevState) => ({ ...prevState, [guid]: data }));
  };

  const onExpandRow = ({ data: { guid } }) => {
    if (!!expandedRowsData[guid]) {
      return;
    }
    getTaskWorkflowExecutionData(guid);
  };

  useEffect(
    () => () => {
      clearBusy();
    },
    [],
  );

  const backupDestinationsBody = ({ backupDestinations }) =>
    backupDestinations.map(({ type: { name } }) => name).join(',');

  const refresh = () => {
    setPage(0);
    setWorkflowExecutionData([]);
  };

  const setFilter = (filter: string) => {
    setGlobalFilter(filter);
    refresh();
  };

  useEffect(() => {
    if (page !== 0 || workflowExecutionData.length > 0) {
      return;
    }
    getWorkflowExecutionData();
  }, [page, workflowExecutionData]);

  return (
    <VirtualScrollTable
      value={workflowExecutionData}
      scrollHeight="1000px"
      getLazyValues={getWorkflowExecutionData}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      onRowExpand={onExpandRow}
      rowExpansionTemplate={({ guid }) =>
        ExpandedWorkflowExecutionTable(expandedRowsData[guid] || [])
      }
      header={Header(refresh, setFilter)}
    >
      <Column expander style={{ maxWidth: '75px' }} />
      <Column
        field="state.name"
        header="State"
        className="text-capitalize"
        body={({ state: { name } }) => name.toLowerCase()}
      />
      <Column field="definitionName" header="Type" />
      <Column
        field="currentStep"
        header="Step"
        body={(element) => (
          <>
            <Tooltip target=".current-workflow-step" />
            <span
              className="current-workflow-step"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: '175px',
              }}
              data-pr-tooltip={element.currentStep}
            >
              {element.currentStep}
            </span>
          </>
        )}
      />
      <Column field="protectedEntity.name" header="Instance" />
      <Column
        field="backupDestination.name"
        header="Backup destination"
        body={backupDestinationsBody}
      />
      <Column
        field="originEntity"
        header="Origin"
        body={originTemplate}
        style={{ maxWidth: '75px' }}
      />
      <Column field="priority" header="Priority" style={{ maxWidth: '75px' }} />
      <Column field="duration" header="Duration" />
      <Column
        field="action"
        header="Action"
        style={{ maxWidth: '75px' }}
        body={({ guid }) => (
          <Button
            icon="pi pi-times"
            onClick={async () => {
              await vprotectService.deleteAllFinishedTasksInWorkflow(guid);
              refresh();
            }}
          />
        )}
      />
    </VirtualScrollTable>
  );
};
