import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import Table from 'components/table/primereactTable';
import getLastElementOfPath from 'components/tabs/getLastElementOfPath';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { getReport } from 'store/reporting/actions';
import {
  sizeTemplate,
  dateTemplate,
  permissionTemplate,
} from 'components/table/templates';

export default () => {
  const type = getLastElementOfPath();
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReport(range));
  }, [range]);
  return (
    <div className="mt-4">
      <Table value={report[type].elements}>
        <Column field="protectedEntity" header="Protected Entity" />
        <Column field="policy" header="Policy" />
        {type === 'backups' && (
          <Column field="snapshotTime" header="Snapshot Time" />
        )}
        {type === 'restores' && (
          <Column field="restoreTime" header="Restore Time" />
        )}
        <Column field="size" header="Size" body={sizeTemplate} />
        <Column field="type" header="Type" />
        <Column field="status" header="Status" />
        <Column field="statusInfo" header="Status Info" />
      </Table>
    </div>
  );
};
