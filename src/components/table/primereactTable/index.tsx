import React, { useState } from 'react';
import {
  DataTable,
  DataTableSelectionChangeParams,
  DataTableSelectionModeType,
} from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { PaginatorTemplate } from 'primereact/paginator';
import { TableParams } from 'components/table/primereactTable/TableParams';

type ApiResponse = {
  body: any[];
  totalCount?: number;
};

type Props = {
  children: any[];
  apiPagination?: boolean;
  value: any;
  onPageChange?: (event: any) => void;
  header?: JSX.Element | string;
  globalFilter?: string;
  selection?: any;
  onSelectionChange?: (event: any) => void;
  selectionMode?: DataTableSelectionModeType;
  rowClassName?: any;
};

const Paginator = {
  layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
  RowsPerPageDropdown: (options) => {
    const dropdownOptions = [
      { label: 5, value: 5 },
      { label: 10, value: 10 },
      { label: 20, value: 20 },
    ];

    return (
      <React.Fragment>
        <span
          className="mx-1"
          style={{ color: 'var(--text-color)', userSelect: 'none' }}
        >
          Items per page:{' '}
        </span>
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      </React.Fragment>
    );
  },
  CurrentPageReport: (options) => (
    <span
      style={{
        color: 'var(--text-color)',
        userSelect: 'none',
        width: '120px',
        textAlign: 'center',
      }}
    >
      {options.first} - {options.last} of {options.totalRecords}
    </span>
  ),
} as PaginatorTemplate;

const Table = ({
  children,
  apiPagination = false,
  onPageChange,
  value,
  ...props
}: Props) => {
  const { page, size } = new TableParams();

  // @ts-ignore
  const { body, totalCount } = value;

  return (
    <div className={'c-table'}>
      <DataTable
        value={body}
        paginator
        paginatorTemplate={Paginator}
        rows={apiPagination ? size : 20}
        first={page * size}
        lazy={apiPagination}
        paginatorClassName="justify-content-end"
        className="mt-6"
        removableSort
        totalRecords={apiPagination ? totalCount : null}
        onPage={(e) => {
          onPageChange(e);
        }}
        {...props}
      >
        {children}
      </DataTable>
    </div>
  );
};

export default Table;
