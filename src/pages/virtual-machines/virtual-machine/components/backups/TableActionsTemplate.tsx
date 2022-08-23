import React from 'react';
import { Button } from 'components/button';
import { hideFooterAction, showModalAction } from 'store/modal/actions';
import { DetailsModal } from 'pages/virtual-machines/modal/DetailsModal';
import { backupsService } from 'services/backups-service';
import { policiesService } from 'services/policies-service';
import { EditRuleModal } from 'pages/virtual-machines/modal/EditRuleModal';

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

  const openEditRuleModal = async () => {
    if (!backup.backupRule) {
      return;
    }
    const rule = await policiesService.getRule(backup.backupRule.guid);
    const primaryBackupDestination = rule.ruleBackupDestinations.find(
      ({ roleType }) => roleType.name === 'PRIMARY',
    );
    const secondaryBackupDestination = rule.ruleBackupDestinations.find(
      ({ roleType }) => roleType.name === 'SECONDARY',
    );

    dispatch(
      showModalAction({
        component: EditRuleModal,
        title: 'Rule Details',
        props: { rule, primaryBackupDestination, secondaryBackupDestination },
        style: { width: '80vw' },
      }),
    );
  };

  return (
    <div className="d-flex justify-content-around">
      <Button
        onClick={openEditRuleModal}
        className="p-button-outlined"
        icon="pi pi-pencil"
      />
      <Button
        onClick={openDetailsModal}
        className="p-button-outlined"
        icon="pi pi-search-plus"
      />
    </div>
  );
};
