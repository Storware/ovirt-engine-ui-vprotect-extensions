import React, { useEffect, useState } from 'react';
import {
  DataTable,
  DataTableSelectionChangeParams,
  DataTableSelectionModeType,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { PaginatorTemplate } from 'primereact/paginator';
import { TableParams } from 'components/table/primereactTable/TableParams';

type Props = {
  children: any[];
  apiPagination?: (event: any) => void;
  value: any;
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

const Table = ({ children, apiPagination, value, ...props }: Props) => {
  const [tableParams, setTableParams] = useState<TableParams>(
    new TableParams(),
  );
  const [unmappedDirection, setUnmappedDirection] =
    useState<DataTableSortOrderType>(0);

  useEffect(() => {
    if (!!apiPagination) {
      apiPagination(tableParams);
    }
  }, [tableParams]);

  const handleOnPage = (e) => {
    setTableParams((prevState) => ({
      ...prevState,
      page: e.page,
      size: e.rows,
    }));
  };
  const handleOnFilter = (e) => {
    if (e?.filters?.globalFilter?.value) {
      setTableParams((prevState) => ({
        ...prevState,
        filter: e.filters.globalFilter.value,
      }));
    } else {
      const { filter, ...newTableParams } = tableParams;
      setTableParams(newTableParams);
    }
  };

  const mappedDirection: { [key: string]: string | null } = {
    '1': 'asc',
    '0': null,
    '-1': 'desc',
  };

  const handleOnSort = (e) => {
    if (e.sortOrder !== 0) {
      setTableParams((prevState) => ({
        ...prevState,
        orderBy: e.sortField,
        direction: mappedDirection[e.sortOrder],
      }));
      setUnmappedDirection(e.sortOrder);
    } else {
      const { orderBy, direction, ...newTableParams } = tableParams;
      setTableParams(newTableParams);
    }
  };

  const { body, totalCount } = !!apiPagination
    ? value
    : { body: value, totalCount: null };

  return (
    <div className={'c-table'}>
      <DataTable
        value={body}
        paginator
        paginatorTemplate={Paginator}
        rows={tableParams.size}
        first={tableParams.page * tableParams.size}
        lazy={!!apiPagination}
        paginatorClassName="justify-content-end"
        className="mt-6"
        removableSort
        totalRecords={totalCount}
        onPage={(e) => handleOnPage(e)}
        onSort={(e) => handleOnSort(e)}
        sortField={tableParams.orderBy}
        sortOrder={unmappedDirection}
        onFilter={(e) => handleOnFilter(e)}
        globalFilter={tableParams.filter}
        {...props}
      >
        {children}
      </DataTable>
    </div>
  );
};

export default Table;
