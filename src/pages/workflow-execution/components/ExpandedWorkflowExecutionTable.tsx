import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getDateLabel } from 'services/time';
import React from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { calculateDuration } from 'pages/workflow-execution/WorkflowExecution';

export const ExpandedWorkflowExecutionTable = (value) => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <DataTable
      value={value}
      scrollable
      scrollHeight="300px"
      style={{ width: '91.5%' }}
    >
      <Column
        field="state.description"
        header="State"
        style={{ minWidth: '15.5%' }}
      />

      <Column
        field="type.description"
        header="Type"
        style={{ maxWidth: '9%' }}
      />
      <Column
        field="progress"
        header="Progress"
        style={{ maxWidth: '8.8%' }}
        body={({ progress }) => (
          <ProgressBar
            className="progress-bar-element"
            value={progress?.toFixed(0)}
            showValue={true}
          />
        )}
      />
      <Column field="node.name" header="Node" style={{ minWidth: '14.5%' }} />
      <Column
        field="windowStart"
        header="Window start"
        style={{ minWidth: '21.1%' }}
        body={({ windowStart }) => getDateLabel(windowStart)}
      />
      <Column
        field="windowEnd"
        header="Window end"
        style={{ minWidth: '21.2%' }}
        body={({ windowEnd }) => getDateLabel(windowEnd)}
      />
      <Column header="Duration" body={(task) => calculateDuration(task)} />
    </DataTable>
  </div>
);
