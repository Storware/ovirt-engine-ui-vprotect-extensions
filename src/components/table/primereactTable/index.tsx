import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { PaginatorTemplate } from 'primereact/paginator';

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

const Table = ({ children, ...props }) => {
  const passData = ({ page, rows }) => {
    props.passChildData(page, rows);
  };
  return (
    <div className={'c-table'}>
      <DataTable
        paginator
        paginatorTemplate={Paginator}
        rows={20}
        {...props}
        paginatorClassName="justify-content-end"
        className="mt-6"
        removableSort
        onPage={(e) => passData(e as any)}
      >
        {children}
      </DataTable>
    </div>
  );
};

export default Table;
