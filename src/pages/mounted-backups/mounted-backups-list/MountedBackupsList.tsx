import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMountedBackupPage,
  getMountedBackupsListPage,
} from '../../../store/mounted-backups/actions';
import { selectMountedBackups } from '../../../store/mounted-backups/selectors';
import { tasksService } from '../../../services/tasks-service';
import { alertService } from '../../../services/alert-service';
import { UnmountTask } from '../../../model/tasks/unmount-task';
import { Menu } from 'primereact/menu';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import Table from 'components/table/primereactTable';
import { dateTemplate } from 'components/table/templates';
import { Button } from 'primereact/button';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { selectPagination } from 'store/pagination/selectors';
import { WorkflowExecutionStates } from 'model/task-panel.model';

export const MountedBackupsList = () => {
  const dispatch = useDispatch();

  const rows = useSelector(selectMountedBackups);
  const [globalFilter, setGlobalFilter] = useState('');
  const [actionsElement, setActionsElement] = useState(null);
  const [detailsRedirect, setDetailsRedirect] = useState(false);
  const tableParams = useSelector(selectPagination);
  const match = useRouteMatch();

  const actions = [
    ...((actionsElement?.backup && [
      {
        label: 'Details',
        command: () => {
          setDetailsRedirect(true);
        },
      },
    ]) ||
      []),
    {
      label: 'Unmount',
      command: async () => {
        const task = new UnmountTask();
        task.mountedBackup = { guid: actionsElement.guid, name: '' };
        await tasksService.submitTaskUnmount(task);
        alertService.info('Unmount task has been submitted');
      },
    },
  ];

  const header = () => (
    <div className="d-flex justify-content-between">
      <div className="p-datatable-globalfilter-container">
        <InputText
          type="search"
          onInput={({ target }) =>
            setGlobalFilter((target as HTMLInputElement).value)
          }
          placeholder="Global Search"
        />
      </div>

      <Button
        className="mr-3"
        onClick={() => dispatch(getMountedBackupPage(tableParams))}
        label="Refresh"
      />
    </div>
  );

  return (
    <div>
      <div>
        <Menu
          model={actions}
          popup
          ref={(el) => (this.menu = el)}
          id="popup_menu"
        />
        <Table
          value={rows}
          header={header()}
          globalFilter={globalFilter}
          apiPagination={(e) => {
            dispatch(getMountedBackupPage(e));
          }}
        >
          <Column
            field="backup.protectedEntity.name"
            header="Virtual Machine"
            sortable
            body={(rowData) => (
              <Link
                to={`virtual_environments/${rowData.backup?.protectedEntity?.guid}`}
              >
                {rowData.backup?.protectedEntity?.name}
              </Link>
            )}
          />
          <Column
            field="mode"
            header="Mode"
            body={(rowData) => <>{rowData.mode?.description}</>}
            sortable
          />
          <Column field="state.description" header="State" />
          <Column
            field="node"
            header="Node"
            body={(rowData) => <>{rowData.node?.name}</>}
            sortable
          />
          <Column
            field="backup.snapshotTime"
            header="Snapshot Date"
            body={dateTemplate}
            sortable
          />
          <Column field="mountedFileSystemCount" header="File systems" />

          <Column
            field="mountedFileCount"
            header="Backup status"
            body={(rowData) =>
              rowData.mountedFileCount ? (
                <span className="text-success">Backup up to date</span>
              ) : typeof rowData.mountedFileCount === 'undefined' ? (
                <span>No schedule defined</span>
              ) : (
                <span className="text-danger">Backup outdated</span>
              )
            }
          />
          <Column
            field="action"
            header="Action"
            body={(rowData) =>
              rowData.state === WorkflowExecutionStates.RUNNING ? (
                <></>
              ) : (
                <Button
                  icon="pi pi-bars"
                  onClick={(event) => {
                    this.menu.toggle(event);
                    setActionsElement(rowData);
                  }}
                  aria-controls="popup_menu"
                  aria-haspopup
                />
              )
            }
          />
        </Table>
      </div>
      {detailsRedirect && (
        <Redirect
          to={{
            pathname: `${match.path}/${actionsElement.guid}`,
          }}
        />
      )}
    </div>
  );
};

export default MountedBackupsList;
