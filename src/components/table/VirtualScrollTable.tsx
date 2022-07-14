import React, { useState, useEffect } from 'react';
import { DataTable, DataTableProps } from 'primereact/datatable';

interface Props extends DataTableProps {
  children: any;
  scrollHeight: string;
  getLazyValues?: () => void;
}

export const VirtualScrollTable = ({
  children,
  getLazyValues,
  value: prevValue,
  ...props
}: Props) => {
  const [value, setValue] = useState([]);
  const [lazyLoading, setLazyLoading] = useState(false);
  const [possibleLoadMore, setPossibleLoadMore] = useState(true);

  useEffect(() => {
    if (prevValue.length === value.length && value.length !== 0) {
      setPossibleLoadMore(false);
      return;
    }
    setValue(prevValue);
    setLazyLoading(false);
  }, [prevValue]);

  const loadValuesLazy = ({ last }) => {
    if (last < value.length || lazyLoading === true || !possibleLoadMore) {
      return;
    }
    setLazyLoading(true);
    getLazyValues?.();
  };
  return (
    <DataTable
      scrollable
      {...props}
      value={value}
      virtualScrollerOptions={{
        lazy: true,
        onLazyLoad: loadValuesLazy,
        delay: 200,
        ...props.virtualScrollerOptions,
      }}
    >
      {children}
    </DataTable>
  );
};
