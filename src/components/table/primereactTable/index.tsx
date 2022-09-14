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
  onPageChange = () => {},
  value,
  ...props
}: Props) => {
  const [tableParams, setTableParams] = useState<TableParams>(
    new TableParams(),
  );

  useEffect(() => {
    onPageChange(tableParams);
  }, [tableParams]);

  const handleOnPage = (e) => {
    setTableParams((prevState) => ({
      ...prevState,
      page: e.page,
      size: e.rows,
    }));
  };

  const unmappedDirection: { [key: string]: DataTableSortOrderType } = {
    asc: 1,
    null: 0,
    desc: -1,
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
        // sortOrder={Object.entries(mappedDirection).find(([key, value]) => value === tableParams.direction);}
        sortOrder={unmappedDirection[tableParams.direction]}
        {...props}
      >
        {children}
      </DataTable>
    </div>
  );
};

export default Table;
