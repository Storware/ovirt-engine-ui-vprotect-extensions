import React, { useEffect, useState } from 'react';
import { BackupModal } from 'components/modal/BackupModal';
import { RestoreModal } from '../modal/RestoreModal';
import { useDispatch, useSelector } from 'react-redux';
import { getVirtualMachinesPage } from 'store/virtual-machines/actions';
import { selectVirtualMachines } from 'store/virtual-machines/selectors';
import { showModalAction } from 'store/modal/actions';
import { MountBackupModal } from 'components/modal/MountBackupModal';
import { nameTemplate } from '../../policies/PoliciesList';
import { createBrowserHistory } from 'history';
import { deleteVirtualMachine } from '../../../store/virtual-machines/actions';
import { getElementWithoutProjectUuidInName } from '../../../utils/byProjectFilter';
import { virtualMachinesService } from '../../../services/virtual-machines-service';
import { alertService } from '../../../services/alert-service';
import { Column } from 'primereact/column';
import Table from 'components/table/primereactTable';
import {
  booleanTemplate,
  dateTemplate,
  sizeTemplate,
} from 'components/table/templates';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

const VirtualMachinesList = () => {
  const dispatch = useDispatch();
  const history = createBrowserHistory();
  const [globalFilter, setGlobalFilter] = useState(null);
  const [actionsElement, setActionsElement] = useState(null);

  useEffect(() => {
    dispatch(getVirtualMachinesPage);
  }, []);

  const rows = useSelector(selectVirtualMachines);

  const deleteNonPresent = async () => {
    await virtualMachinesService.deleteAllNonPresentAndWithoutBackup();
    dispatch(getVirtualMachinesPage);
    alertService.info('Absent virtual machines have been deleted');
  };

  const header = () => {
    return (
      <div>
        Virtual Machines
        <div className="d-flex justify-content-between">
          <div className="p-datatable-globalfilter-container">
            <InputText
              type="search"
              // @ts-ignore
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global Search"
            />
          </div>
          <Button
            className="p-button-danger"
            label="Delete Non-Present"
            onClick={() => {
              deleteNonPresent();
            }}
          />
        </div>
      </div>
    );
  };

  const actions = [
    {
      label: 'Backup',
      command: () => {
        dispatch(
          showModalAction({
            component: BackupModal,
            props: {
              virtualEnvironments: [actionsElement],
            },
            title: 'Backup',
          }),
        );
      },
    },
    {
      label: 'Mount',
      command: () => {
        dispatch(
          showModalAction({
            component: MountBackupModal,
            props: {
              guid: actionsElement.guid,
            },
            title: 'Mount Backup',
          }),
        );
      },
    },
    {
      label: 'Restore',
      command: () => {
        dispatch(
          showModalAction({
            component: RestoreModal,
            props: {
              virtualEnvironment: actionsElement,
            },
            title: 'Restore',
          }),
        );
      },
    },
    {
      label: 'Delete',
      command: () => {
        dispatch(deleteVirtualMachine(actionsElement));
      },
    },
  ];

  return (
    <div>
      <Menu
        model={actions}
        popup
        ref={(el) => (this.menu = el)}
        id="popup_menu"
      />
      <Table value={rows} header={header()} globalFilter={globalFilter}>
        <Column field="name" header="Name" body={nameTemplate(history)} />
        <Column field="uuid" header="Uuid" />
        <Column field="present" header="Present" body={booleanTemplate} />
        <Column field="hypervisor.name" header="Hypervisor" />
        <Column
          field="vmBackupPolicy"
          header="Policy"
          body={(rowData) =>
            rowData.vmBackupPolicy &&
            getElementWithoutProjectUuidInName(rowData.vmBackupPolicy).name
          }
        />
        <Column
          field="backupUpToDate"
          header="Backup status"
          body={(rowData) =>
            rowData.backupUpToDate ? (
              <span className="text-success">Backup up to date</span>
            ) : typeof rowData.backupUpToDate === 'undefined' ? (
              <span>No schedule defined</span>
            ) : (
              <span className="text-danger">Backup outdated</span>
            )
          }
        />
        <Column
          field="lastBackup"
          header="Last backup date"
          body={dateTemplate}
        />
        <Column
          field="lastSuccessfulBackupSize"
          header="Last backup size"
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
    </div>
  );
};

export default VirtualMachinesList;
