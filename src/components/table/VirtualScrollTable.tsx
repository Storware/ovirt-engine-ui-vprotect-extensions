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
  value: changedValue,
  ...props
}: Props) => {
  const [value, setValue] = useState([]);
  const [lazyLoading, setLazyLoading] = useState(false);

  useEffect(() => {
    // On refreshed data
    if (changedValue.length === 0 && value.length > 0) {
      setValue(changedValue);
      return;
    }
    if (changedValue.length <= value.length && value.length !== 0) {
      return;
    }
    setValue(changedValue);
    setLazyLoading(false);
  }, [changedValue]);

  const loadValuesLazy = ({ last }) => {
    if (last === 0 || last < value.length || lazyLoading === true) {
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
        delay: 200,
        itemSize: 50,
        onLazyLoad: loadValuesLazy,
        ...props.virtualScrollerOptions,
      }}
    >
      {children}
    </DataTable>
  );
};
