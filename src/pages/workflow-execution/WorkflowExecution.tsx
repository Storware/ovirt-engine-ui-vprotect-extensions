import React, { useEffect, useState } from 'react';
import { vprotectService } from 'services/vprotect-service';
import { Column } from 'primereact/column';
import { VirtualScrollTable } from 'components/table/VirtualScrollTable';
import { convertMilisecondsToHours } from 'utils/convertMilisecondsToHours';
import { originTemplate } from 'components/table/templates';
import { Header } from './components/Header';
import { Button } from 'primereact/button';
import { ExpandedWorkflowExecutionTable } from 'pages/workflow-execution/components/ExpandedWorkflowExecutionTable';
import { WorkflowExecutionStates } from 'model/task-panel.model';
import { Tooltip } from 'primereact/tooltip';
import { DataNameSets, SortTypes } from './models';
import { SortDirection } from 'model';
import { ProgressBar } from 'primereact/progressbar';

export const calculateDuration = (task) => {
  if (
    task.startTime &&
    !task.finishTime &&
    task.state.name === WorkflowExecutionStates.RUNNING
  ) {
    return convertMilisecondsToHours(+new Date() - task.startTime);
  }
  if (task.finishTime && task.startTime) {
    return convertMilisecondsToHours(task.finishTime - task.startTime);
  }
  return '';
};

export const WorkflowExecution = () => {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [workflowExecutionData, setWorkflowExecutionData] = useState([]);
  const [page, setPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRowsData, setExpandedRowsData] = useState({});
  const [sort, setSort] = useState<SortTypes>({
    orderBy: 'state',
    direction: SortDirection.Empty,
  });
  const ITEMS_LOAD = 40;
  const [durationTimes, setDurationTimes] = useState([]);
  const [tick, setTick] = useState<boolean>(false);

  const handleSort = ({ sortField }) => {
    const orderByWhat = DataNameSets[sortField];
    setSort({
      orderBy: orderByWhat,
      direction:
        orderByWhat === sort.orderBy && sort.direction === SortDirection.Asc
          ? SortDirection.Desc
          : SortDirection.Asc,
    });
  };

  useEffect(() => {
    refresh();
  }, [sort]);

  const getWorkflowExecutionData = async () => {
    const data = await vprotectService.getWorkflowExecution({
      page,
      size: ITEMS_LOAD,
      orderBy: sort.orderBy,
      direction: sort.direction,
      filter: globalFilter,
    });
    setPage((_page) => _page + 1);
    if (data && data.length > 0) {
      setWorkflowExecutionData(data);

      if (expandedRows && expandedRows.length > 0) {
        const newExpandedRows = data
          .filter(
            (workflow) =>
              !!expandedRows.find((item) => item.guid === workflow.guid),
          )
          .filter((v, i, a) => a.findIndex((v2) => v2.guid === v.guid) === i);

        if (newExpandedRows && newExpandedRows.length > 0) {
          newExpandedRows.forEach(({ guid }) =>
            getTaskWorkflowExecutionData(guid),
          );
        }
        setExpandedRows(newExpandedRows);
      }
    }
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

  const updateDurationTimes = () => {
    if (workflowExecutionData && workflowExecutionData.length > 0) {
      setDurationTimes(
        workflowExecutionData.map((we) => ({
          guid: we.guid,
          duration: calculateDuration(we),
        })),
      );
    }
  };

  useEffect(() => {
    const durationInterval = setInterval(() => {
      setTick((prev) => !prev);
    }, 1000);

    return () => clearInterval(durationInterval);
  }, []);

  useEffect(() => {
    updateDurationTimes();
  }, [tick]);

  const backupDestinationsBody = (backupDestinations) =>
    backupDestinations.map(({ name }) => name).join('-');

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
      onSort={handleSort}
      onRowToggle={({ data }) => setExpandedRows(data)}
      onRowExpand={onExpandRow}
      rowExpansionTemplate={({ guid }) =>
        ExpandedWorkflowExecutionTable(expandedRowsData[guid])
      }
      header={Header(refresh, setFilter)}
    >
      <Column expander style={{ maxWidth: '75px' }} />
      <Column
        sortable
        field="state.name"
        header="State"
        style={{ width: '100px', textAlign: 'center' }}
        className="text-capitalize"
        body={({ state: { description } }) => description.toLowerCase()}
      />
      <Column field="definitionName" header="Type" sortable />

      <Column
        field="averageProgress"
        header="Progress"
        body={({ averageProgress }) => (
          <ProgressBar
            className="progress-bar-element"
            value={averageProgress?.toFixed(0)}
            showValue={true}
          />
        )}
      />
      <Column
        sortable
        field="currentStep"
        header="Step"
        body={({ currentStep }) => (
          <>
            <Tooltip target=".current-workflow-step" />
            <span
              className="current-workflow-step column-cut-text"
              style={{
                minWidth: '75px',
                maxWidth: '200px',
              }}
              data-pr-tooltip={currentStep}
            >
              {currentStep}
            </span>
          </>
        )}
      />
      <Column
        sortable
        field="protectedEntity.name"
        header="Instance"
        body={({ protectedEntity }) => (
          <>
            <Tooltip target=".current-workflow-instance" />
            <span
              className="current-workflow-instance column-cut-text"
              style={{ width: '200px' }}
              data-pr-tooltip={protectedEntity?.name}
            >
              {protectedEntity?.name}
            </span>
          </>
        )}
      />
      <Column
        field="backupDestination.name"
        header="Backup destination"
        body={({ backupDestinations }) => (
          <>
            <Tooltip target=".current-workflow-backup-destination" />
            <span
              className="current-workflow-backup-destination column-cut-text"
              style={{ width: '150px' }}
              data-pr-tooltip={
                backupDestinations && backupDestinationsBody(backupDestinations)
              }
            >
              {backupDestinations && backupDestinationsBody(backupDestinations)}
            </span>
          </>
        )}
      />
      <Column
        sortable
        field="originEntity"
        header="Origin"
        body={originTemplate}
        style={{ maxWidth: '100px' }}
      />
      <Column
        field="priority"
        sortable
        header="Priority"
        style={{ maxWidth: '75px' }}
      />
      <Column
        body={(we) =>
          durationTimes && durationTimes.length > 0
            ? durationTimes.find((item) => item.guid === we.guid)?.duration
            : ''
        }
        header="Duration"
      />
      <Column
        field="action"
        header="Action"
        style={{ maxWidth: '125px' }}
        body={({ guid }) => (
          <Button
            label="Remove"
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
