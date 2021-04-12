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
import VirtualMachine from '../virtual-machines/virtual-machine/VirtualMachine';
import {Switch, Route, useRouteMatch, Link} from 'react-router-dom';
import {createBrowserHistory} from 'history';


export default () => {
  const type = getLastElementOfPath();
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const dispatch = useDispatch();

  const history = createBrowserHistory();

  useEffect(() => {
    dispatch(getReport(range));
  }, [range]);

  const statusVirtualEnvironment = (rowData) => {
    const statusClassName = classNames({
      'text-danger': rowData.status === 'Failed',
      'text-info': rowData.status === 'Success (removed)',
    });

    return (
        <div className={statusClassName}>
          {rowData.status}
        </div>
    );
  }

  const nameLink = (rowData) => {
    return (
        <td>
          <Link to={`${history.location.pathname}/${rowData.backupGuid}`}>{rowData.protectedEntity}</Link>
        </td>
    );
  }

  const switchPages = () => {
    let match = useRouteMatch();
    return (
        <Switch>
          <Route path={`${match.path}/:guid`}>
            <VirtualMachine />
          </Route>
          <Route path={match.path}>
            {reportsList}
          </Route>
        </Switch>
    );
  }
    const rowClassName = () => {
        return {'StyleRow' : true};
    }

  const reportsList = () => {
    return (
        <div className="mt-4">
          <Table value={report[type].elements} rowClassName={rowClassName}>
            <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '15%' }} field="protectedEntity" header="Virtual Environment" body={nameLink}/>
            <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '10%' }} field="policy" header="Policy" />
            {type === 'backups' && (
                <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '15%' }} field="snapshotTime" header="Snapshot Time" />
            )}
            {type === 'restores' && (
                <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '15%' }} field="restoreTime" header="Restore Time" />
            )}
            <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '10%' }} field="size" header="Size" body={sizeTemplate} />
            <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '10%' }} field="type" header="Type" />
            <Column headerClassName="StyleHeader" bodyClassName="StyleBody" style={{ width: '10%' }} field="status" header="Status" body={statusVirtualEnvironment} />
            <Column headerClassName="StyleHeader" bodyClassName="StyleBody" field="statusInfo" header="Status Info"/>
          </Table>
          </div>
    );
  }

  return switchPages();
};
