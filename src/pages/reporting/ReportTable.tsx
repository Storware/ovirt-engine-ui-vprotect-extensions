import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import Table from 'components/table/primereactTable';
import getLastElementOfPath from 'components/tabs/getLastElementOfPath';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { getReport } from 'store/reporting/actions';
import { sizeTemplate } from 'components/table/templates';
import classNames from 'classnames';
import './ReportTable.scss';
import { Link } from 'react-router-dom';
import { getElementWithoutProjectUuidInName } from 'utils/byProjectFilter';
import { dateTemplate } from 'components/table/templates';

const virtualEnvironmentStatus = (rowData) => {
  const statusClassName = classNames({
    'text-danger': rowData.status === 'Failed',
    'text-info': rowData.status === 'Success (removed)',
  });

  return <div className={statusClassName}>{rowData.status}</div>;
};

const nameLink = (rowData) => {
  return (
    <div>
      {rowData.protectedEntityGuid ? (
        <Link to={`/virtual_environments/${rowData.protectedEntityGuid}`}>
          {rowData.protectedEntity}
        </Link>
      ) : (
        rowData.protectedEntity
      )}
    </div>
  );
};

const rowClassName = () => {
  return { StyleRow: true };
};

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
      <Table value={report[type].elements} rowClassName={rowClassName}>
        <Column
          style={{ width: '15%' }}
          field="protectedEntity"
          header="Virtual Environment"
          body={nameLink}
        />
        <Column
          style={{ width: '10%' }}
          field="policy"
          header="Policy"
          body={(rowData) =>
            rowData.policy &&
            getElementWithoutProjectUuidInName({ name: rowData.policy }).name
          }
        />
        {type === 'backups' && (
          <Column
            style={{ width: '15%' }}
            field="snapshotTime"
            header="Snapshot Time"
            body={dateTemplate}
          />
        )}
        {type === 'restores' && (
          <Column
            style={{ width: '15%' }}
            field="restoreTime"
            header="Restore Time"
            body={dateTemplate}
          />
        )}
        <Column
          style={{ width: '10%' }}
          field="size"
          header="Size"
          body={sizeTemplate}
        />
        <Column style={{ width: '10%' }} field="type" header="Type" />
        <Column
          style={{ width: '10%' }}
          field="status"
          header="Status"
          body={virtualEnvironmentStatus}
        />
        <Column field="statusInfo" header="Status Info" />
      </Table>
    </div>
  );
};
