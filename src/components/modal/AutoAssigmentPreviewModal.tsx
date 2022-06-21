import React from 'react';
import { Column } from 'primereact/column';
import Table from 'components/table/primereactTable';

export const AutoAssigmentPreviewModal = ({ value }) => (
  <Table value={value}>
    <Column field="protectedEntity.name" header="Name" />
    <Column field="changeType.description" header="Operation" />
    <Column field="changeReason.description" header="Reason" />
  </Table>
);
