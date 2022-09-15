import React, { useEffect, useState } from 'react';
import { BackupModal } from 'components/modal/BackupModal/BackupModal';
import { useDispatch, useSelector } from 'react-redux';
import {
  getVirtualMachinesPage,
  getFilteredVirtualMachinesPage,
} from 'store/virtual-machines/actions';
import { selectVirtualMachines } from 'store/virtual-machines/selectors';
import { showModalAction } from 'store/modal/actions';
import { MountBackupModal } from 'components/modal/MountBackupModal';
import { nameTemplate } from 'components/table/templates';
import { createBrowserHistory } from 'history';
import { deleteVirtualMachine } from '../../../store/virtual-machines/actions';
import { virtualMachinesService } from '../../../services/virtual-machines-service';
import { policiesService } from '../../../services/policies-service';
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
import { RestoreModal } from 'pages/virtual-machines/modal/RestoreModal';
import HeaderTable from '../../../components/table/HeaderTable';
import { backupsService } from '../../../services/backups-service';
import { resetMountTaskAction } from '../../../store/mount-backup-modal/actions';
import { NoActiveRulesIcon } from 'components/modal/BackupModal/NoActiveRulesIcon';
import { selectIsSelectedRulesZero } from 'store/backup-modal/selectors';
import { resetRestoreTaskAction } from '../../../store/restore-modal/actions';

const VirtualMachinesList = () => {
  const dispatch = useDispatch();
  const history = createBrowserHistory();
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

  const filteredVirtualMachines = async (param) => {
    await virtualMachinesService.getFilteredVirtualMachines(param);
    dispatch(getFilteredVirtualMachinesPage(param));
  };

  const header = () => (
    <HeaderTable>
      <div className="p-datatable-globalfilter-container">
        <InputText
          type="search"
          onInput={({ target }) =>
            filteredVirtualMachines((target as HTMLInputElement).value)
          }
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
    </HeaderTable>
  );

  const actions = [
    {
      label: 'Backup',
      command: async () => {
        if (!actionsElement.vmBackupPolicy) {
          alertService.error(
            'Virtual machine is not assigned to the backup policy',
          );
          return;
        }

        const policies = await policiesService.getPoliciesByEntities(
          actionsElement.guid,
        );

        if (!policies.length) {
          alertService.error(
            'Virtual machine is not assigned to the backup policy with rules',
          );
          return;
        }

        dispatch(
          showModalAction({
            component: BackupModal,
            FooterContent: () =>
              NoActiveRulesIcon({
                entities: [
                  {
                    ...actionsElement,
                    policy: useSelector(selectIsSelectedRulesZero),
                  },
                ],
              }),
            props: {
              virtualEnvironments: [
                { ...actionsElement, vmBackupPolicy: policies[0] },
              ],
            },
            title: 'Backup',
          }),
        );
      },
    },
    {
      label: 'Mount',
      command: async () => {
        dispatch(resetMountTaskAction());
        const mountableBackups = await backupsService.getMountableBackups(
          actionsElement.guid,
        );
        if (!mountableBackups.length) {
          alertService.error(
            'There are no mountable backups for this virtual environment',
          );
          return;
        }

        dispatch(
          showModalAction({
            component: MountBackupModal,
            props: {
              virtualEnvironment: actionsElement,
              backups: mountableBackups,
            },
            title: 'Mount Backup',
          }),
        );
      },
    },
    {
      label: 'Restore',
      command: () => {
        dispatch(resetRestoreTaskAction());
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
      <Table value={rows} header={header()}>
        <Column
          field="name"
          header="Name"
          body={nameTemplate(history, 'uuid')}
          sortable
        />
        <Column
          field="present"
          header="Present"
          body={booleanTemplate}
          sortable
        />
        <Column field="hypervisor.name" header="Hypervisor" sortable />
        <Column
          field="vmBackupPolicy"
          header="Policy"
          filterField="vmBackupPolicy.name"
          sortable
          body={(rowData) =>
            rowData.vmBackupPolicy &&
            getElementWithoutProjectUuidInName(rowData.vmBackupPolicy).name
          }
        />
        <Column
          field="backupUpToDate"
          header="Backup status"
          sortable
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
          sortable
        />
        <Column
          field="lastSuccessfulBackupSize"
          header="Last backup size"
          body={sizeTemplate}
          sortable
        />

        <Column
          field="action"
          header="Action"
          sortable
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
