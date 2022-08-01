import { convertMilisecondsToHours } from 'utils/convertMilisecondsToHours';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getDateLabel } from 'services/time';
import React from 'react';

export const ExpandedWorkflowExecutionTable = (value) => {
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
