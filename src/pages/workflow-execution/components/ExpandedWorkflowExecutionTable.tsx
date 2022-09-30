import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getDateLabel } from 'services/time';
import React from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { calculateDuration } from 'pages/workflow-execution/WorkflowExecution';

export const ExpandedWorkflowExecutionTable = (value) => (
  <DataTable
    value={value}
    scrollable
    scrollHeight="300px"
    style={{ width: '100%' }}
  >
    <Column field="state.description" header="State" />

    <Column
      field="progress"
      header="Progress"
      body={({ progress }) => (
        <ProgressBar
          className="progress-bar-element"
          value={progress?.toFixed(0)}
          showValue={true}
        />
      )}
    />
    <Column field="type.description" header="Type" />
    <Column field="node.name" header="Node" />
    <Column header="Duration" body={(task) => calculateDuration(task)} />
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
