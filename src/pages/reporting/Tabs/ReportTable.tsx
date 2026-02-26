import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Column } from 'primereact/column';
import classNames from 'classnames';
import Table from '@/components/table/primereactTable';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { getReport } from 'store/reporting/actions';
import { sizeTemplate } from 'components/table/templates';
import 'pages/reporting/Tabs/ReportTable.scss';
import { getElementWithoutProjectUuidInName } from 'utils/byProjectFilter';
import { dateTemplate } from 'components/table/templates';

const virtualEnvironmentStatus = (rowData) => {
  const statusClassName = classNames({
    'text-danger': rowData.status.description === 'Failed',
    'text-info': rowData.status.description === 'Success (removed)',
  });

  return <div className={statusClassName}>{rowData.status.description}</div>;
};

const getLastElementOfPath = () => {
  const pathParts = location.pathname.split('/');
  return pathParts[pathParts.length - 1];
};

const nameLink = (rowData) => (
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

const rowClassName = () => ({ StyleRow: true });

const ReportTable = () => {
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
          sortable
        />
        <Column
          style={{ width: '10%' }}
          field="policy"
          header="Policy"
          sortable
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
            sortable
            body={dateTemplate}
          />
        )}
        {type === 'restores' && (
          <Column
            style={{ width: '15%' }}
            field="restoreTime"
            header="Restore Time"
            body={dateTemplate}
            sortable
          />
        )}
        <Column
          style={{ width: '10%' }}
          field="size"
          header="Size"
          body={sizeTemplate}
          sortable
        />
        <Column style={{ width: '10%' }} field="type" header="Type" sortable />
        <Column
          style={{ width: '10%' }}
          field="status"
          header="Status"
          body={virtualEnvironmentStatus}
          sortable
        />
        <Column field="statusInfo" header="Status Info" />
      </Table>
    </div>
  );
};

export default ReportTable;
