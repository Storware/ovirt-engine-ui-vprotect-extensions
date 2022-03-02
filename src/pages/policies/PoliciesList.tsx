import React, { useEffect, useState } from 'react';
import { policiesService } from 'services/policies-service';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPolicies,
  removePolicy,
  snapshotPolicy,
} from 'store/policies/actions';
import { selectPolicies } from 'store/policies/selectors';
import { showModalAction } from 'store/modal/actions';
import { BackupModal } from 'components/modal/BackupModal/BackupModal';
import { createBrowserHistory } from 'history';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { sizeTemplate } from 'components/table/templates';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import Table from 'components/table/primereactTable';
import { booleanTemplate } from 'components/table/templates';

export const nameTemplate = (history) => (rowData, column) => {
  return (
    <Link to={`${history.location.pathname}/${rowData.guid}`}>
      {rowData[column.field]}
    </Link>
  );
};

export const PoliciesList = () => {
  const dispatch = useDispatch();
  const { type } = useParams();
  const history = createBrowserHistory();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [actionsElement, setActionsElement] = useState(null);

  useEffect(() => {
    dispatch(getPolicies(type));
  }, [type]);

  const rows = useSelector(selectPolicies);

  const removeAction = {
    label: 'Remove',
    command: () => {
      dispatch(removePolicy(type, actionsElement.guid));
    },
  };

  const actions = {
    'vm-backup': [
      {
        label: 'Backup',
        command: async () => {
          const policy = await policiesService.getPolicy(
            'vm-backup',
            actionsElement.guid,
          );
          dispatch(
            showModalAction({
              component: BackupModal,
              props: {
                virtualEnvironments: policy.vms,
                showIncremental: true,
              },
              title: 'Backup',
            }),
          );
        },
      },
      removeAction,
    ],
    'vm-snapshot': [
      {
        label: 'Snapshot',
        command: () => {
          dispatch(snapshotPolicy(type, actionsElement));
        },
      },
      removeAction,
    ],
  };

  const header = () => {
    return (
      <div>
        <div className="d-flex justify-content-between mt-2">
          <div className="p-datatable-globalfilter-container">
            <InputText
              type="search"
              // @ts-ignore
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global Search"
            />
          </div>
          <div>
            <Link to={`${history.location.pathname}/create`}>
              <Button label="Create" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Menu
        model={actions[type]}
        popup
        ref={(el) => (this.menu = el)}
        id="popup_menu"
      />
      {type === 'vm-backup' ? (
        <Table value={rows} header={header()} globalFilter={globalFilter}>
          <Column field="name" header="Name" body={nameTemplate(history)} />
          <Column field="active" header="Active" body={booleanTemplate} />
          <Column
            field="backupDestinations[0].name"
            header="Backup Destiantion"
            body={(e) => e.backupDestinations[0].name}
          />
          <Column field="priority" header="Priority" />
          <Column field="vmCount" header="VM Count" />
          <Column
            field="averageBackupSize"
            header="Average Backup Size"
            body={sizeTemplate}
          />
          <Column
            field="action"
            header="Action"
            body={(rowData) => (
              <Button
                icon="pi pi-bars"
                onClick={(event) => {
                  this.menu.toggle(event);
                  setActionsElement(rowData);
                }}
                aria-controls="popup_menu"
                aria-haspopup
              />
            )}
          />
        </Table>
      ) : (
        <Table value={rows} header={header()} globalFilter={globalFilter}>
          <Column field="name" header="Name" body={nameTemplate(history)} />
          <Column field="priority" header="Priority" />
          <Column field="ruleCount" header="Rule Count" />
          <Column
            field="action"
            header="Action"
            body={(rowData) => (
              <Button
                icon="pi pi-bars"
                onClick={(event) => {
                  this.menu.toggle(event);
                  setActionsElement(rowData);
                }}
                aria-controls="popup_menu"
                aria-haspopup
              />
            )}
          />
        </Table>
      )}
    </>
  );
};

export default PoliciesList;
