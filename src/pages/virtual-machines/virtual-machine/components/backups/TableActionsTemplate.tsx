import React from 'react';
import { Button } from 'primereact/button';
import { hideFooterAction, showModalAction } from 'store/modal/actions';
import { DetailsModal } from 'pages/virtual-machines/modal/DetailsModal';
import { backupsService } from 'services/backups-service';

export const TableActionsTemplate = (backup, dispatch) => {
  dispatch(hideFooterAction());

  const openDetailsModal = async () => {
    const fileSystems = await backupsService.getBackupFileSystems(backup.guid);
    const files = await backupsService.getBackupFiles(backup.guid);
    dispatch(
      showModalAction({
        component: DetailsModal,
        title: 'Backup Details',
        props: { fileSystems, files, backup },
        style: { width: '80vw' },
      }),
    );
  };

  return (
    <Button
      onClick={openDetailsModal}
      className="p-button-outlined"
      icon="pi pi-search-plus"
    />
  );
};
