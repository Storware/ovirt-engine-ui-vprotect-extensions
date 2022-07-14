import React, { useEffect, useState } from 'react';
import { vprotectService } from '../../services/vprotect-service';
import { Column } from 'primereact/column';
import { VirtualScrollTable } from 'components/table/VirtualScrollTable';
import { DataTable } from 'primereact/datatable';
import { convertMilisecondsToHours } from 'utils/convertMilisecondsToHours';
import { getDateLabel } from 'services/time';

export const WorkflowExecution = () => {
  const [workflowExecutionData, setWorkflowExecutionData] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRowsData, setExpandedRowsData] = useState({});
  const ITEM_SIZE = 60;
  const [busy, setBusy] = useState<ReturnType<typeof setTimeout>[]>([]);

  const clearBusy = () => {
    busy.filter(Boolean).forEach((interval) => {
      clearInterval(interval);
    });
    setBusy([]);
  };

  const addDurationToTasks = (tasks = [], setRows) =>
    tasks.map((task) => {
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
    const data = await vprotectService.getWorkflowExecution(page, ITEM_SIZE);
    setWorkflowExecutionData(
      addDurationToTasks(
        [...workflowExecutionData, ...data],
        setWorkflowExecutionData,
      ),
    );
    setPage((_page) => _page + 1);
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

  const ExpandedWorkflowExecutionTable = (value) => {
    const taskDuration = (task) => {
      if (task.state.name !== 'RUNNING' && !task.startTime && task.finishTime) {
        return '00:00:00';
      }

      if (task.state.name !== 'RUNNING' && task.startTime && task.finishTime) {
        return convertMilisecondsToHours(task.finishTime - task.startTime);
      }

      return '';
    };

    return (
      <DataTable
        value={value}
        scrollable
        scrollHeight="300px"
        style={{ width: '100%' }}
      >
        <Column field="state.description" header="State" />
        <Column field="type.description" header="Type" />
        <Column field="node.name" header="Node" />
        <Column
          field="duration"
          header="Duration"
          body={(task) => taskDuration(task)}
        />
        <Column
          field="windowStart"
          header="Window start"
          body={({ windowStart }) => getDateLabel(windowStart)}
        />
        <Column
          field="windowEnd"
          header="Window end"
          body={({ windowEnd }) => getDateLabel(windowEnd)}
        />
      </DataTable>
    );
  };

  const backupDestinationsBody = ({ backupDestinations }) =>
    backupDestinations.map(({ type: { name } }) => name).join(',');

  return (
    <VirtualScrollTable
      value={workflowExecutionData}
      scrollHeight="500px"
      getLazyValues={getWorkflowExecutionData}
      virtualScrollerOptions={{ itemSize: ITEM_SIZE }}
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      onRowExpand={onExpandRow}
      rowExpansionTemplate={({ guid }) =>
        ExpandedWorkflowExecutionTable(expandedRowsData[guid] || [])
      }
    >
      <Column expander style={{ width: '3em' }} />
      <Column
        field="state.name"
        header="State"
        className="text-capitalize"
        body={({ state: { name } }) => name.toLowerCase()}
      />
      <Column field="definitionName" header="Type" />
      <Column field="currentStep" header="Step" />
      <Column
        field="backupDestination.name"
        header="Backup destination"
        body={backupDestinationsBody}
      />
      <Column field="priority" header="Priority" />
      <Column field="duration" header="Duration" />
    </VirtualScrollTable>
  );
};
