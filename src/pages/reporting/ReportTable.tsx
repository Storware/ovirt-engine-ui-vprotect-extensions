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
import classNames from 'classnames';
import './ReportTable.scss';

export default () => {
  const type = getLastElementOfPath();
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReport(range));
  }, [range]);

  const statusVirtualEnvironment = (rowData) => {
    const statusClassName = classNames({
      'Failed': rowData.status === 'Failed',
      'Success': rowData.status === 'Success (removed)',
    });

    return (
        <div className={statusClassName}>
          {rowData.status}
        </div>
    );
  }
  return (
    <div className="mt-4">
      <Table value={report[type].elements}>
        <Column style={{ width: '15%' }} field="protectedEntity" header="Virtual Environment" />
        <Column style={{ width: '10%' }} field="policy" header="Policy" />
        {type === 'backups' && (
          <Column style={{ width: '15%' }} field="snapshotTime" header="Snapshot Time" />
        )}
        {type === 'restores' && (
          <Column style={{ width: '15%' }} field="restoreTime" header="Restore Time" />
        )}
        <Column style={{ width: '10%' }} field="size" header="Size" body={sizeTemplate} />
        <Column style={{ width: '10%' }} field="type" header="Type" />
        <Column style={{ width: '10%' }} field="status" header="Status" body={statusVirtualEnvironment} />
        <Column field="statusInfo" header="Status Info" />
      </Table>
    </div>
  );
};
