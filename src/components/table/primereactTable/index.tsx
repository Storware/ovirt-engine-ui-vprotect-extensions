import React, { useEffect, useState } from 'react';
import {
  DataTable,
  DataTableSelectionModeType,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { PaginatorTemplate } from 'primereact/paginator';
import { TableParams } from 'model/pagination/TableParams';
import { useDispatch, useSelector } from 'react-redux';
import { selectPagination } from '../../../store/pagination/selectors';
import {
  resetPagination,
  setPaginationDirection,
  setPaginationFilter,
  setPaginationOrderBy,
  setPaginationPage,
  setPaginationSize,
} from '../../../store/pagination/actions';

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
  const tableParams = useSelector(selectPagination);
  const dispatch = useDispatch();

  const [unmappedDirection, setUnmappedDirection] =
    useState<DataTableSortOrderType>(0);

  useEffect(() => {
    dispatch(resetPagination());
  }, []);

  useEffect(() => {
    if (!!apiPagination) apiPagination(tableParams);
  }, [tableParams]);

  const handleOnPage = (e) => {
    dispatch(setPaginationPage(e.page));
    dispatch(setPaginationSize(e.rows));
  };

  const handleOnFilter = (e) => {
    if (e?.filters?.globalFilter?.value) {
      dispatch(setPaginationFilter(e.filters.globalFilter.value));
      return;
    }
    dispatch(setPaginationFilter(''));
  };

  const mappedDirection: { [key: string]: string | null } = {
    '1': 'asc',
    '0': null,
    '-1': 'desc',
  };

  const handleOnSort = (e) => {
    if (e.sortOrder !== 0) {
      dispatch(setPaginationOrderBy(e.sortField));
      dispatch(setPaginationDirection(mappedDirection[e.sortOrder]));
      setUnmappedDirection(e.sortOrder);
      return;
    }
    dispatch(setPaginationOrderBy(''));
    dispatch(setPaginationDirection(''));
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
