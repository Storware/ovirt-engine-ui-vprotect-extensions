import React, { useEffect, useState } from 'react';
import { schedulesService } from '../../../services/schedules-service';
import Text from '../../../components/input/Text';
import { ListBox } from 'primereact/listbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { BackupDestination } from 'model/backup-destination/backup-destination';
import { NameAndGuid } from 'model/dto/nameAndGuid';
import { BackupDestinationRetentionFactory } from 'model/backup-destination/backup-destination-retention-factory';
import { BackupDestinationComponent } from './BackupDestinationComponent';
import { BackupDestinationRule } from 'model/backup-destination/backup-destination-rule';

export const RulesContainer = ({
  rule,
  backupDestinations,
  updateBackupDestinations,
  removeRule,
  policyType,
}) => {
  const [backupDestinationType, setBackupDestinationType] = useState(null);
  const [backupDestinationsCopy] = useState(backupDestinations);
  const [schedules, setSchedules] = useState([]);
  const [factor] = useState(24 * 60 * 60 * 1000);

  useEffect(() => {
    schedulesService.getAllTypeSchedules('VM_BACKUP').then((result) => {
      setSchedules(result);
    });
    updateBackupDestination();
    updateBackupDestinations();
  }, []);

  const updateBackupDestination = (event?) => {
    setBackupRetentionSettings();
    updateBackupDestinations();

    event?.preventDefault();
  };

  useEffect(() => {
    updateBackupDestination();
  }, [rule]);

  const setBackupRetentionSettings = () => {
    if (
      !rule.ruleBackupDestinations.primaryBackupDestination
        .backupRetentionSettings.retentionKeepLastNFull
    ) {
      setTypeAndRetention(
        rule.ruleBackupDestinations.primaryBackupDestination.backupDestination,
      );
    } else {
      setType(
        rule.ruleBackupDestinations.primaryBackupDestination.backupDestination,
      );
    }
  };

  const setTypeAndRetention = (
    selectedBackupDestination: BackupDestination | NameAndGuid,
  ) => {
    setType(selectedBackupDestination);
    if (!backupDestinationType) {
      return;
    }

    rule.ruleBackupDestinations.primaryBackupDestination = {
      ...rule.ruleBackupDestinations.primaryBackupDestination,
      backupRetentionSettings: new BackupDestinationRetentionFactory[
        backupDestinationType
      ](),
    };
    if (!!rule.ruleBackupDestinations.secondaryBackupDestination) {
      rule.ruleBackupDestinations.secondaryBackupDestination = {
        ...rule.ruleBackupDestinations.secondaryBackupDestination,
        backupRetentionSettings: new BackupDestinationRetentionFactory[
          backupDestinationType
        ](),
      };
    }
  };

  const setType = (
    selectedBackupDestination: BackupDestination | NameAndGuid,
  ) => {
    if (!backupDestinationsCopy.length) {
      return;
    }
    setBackupDestinationType(
      backupDestinationsCopy.find(
        ({ guid }) => guid === selectedBackupDestination.guid,
      )?.type?.name,
    );
  };

  const emitRemoveRule = (event) => {
    removeRule();
    event.preventDefault();
  };

  const setRetentionSettingsValue = (key, value) => {
    rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings[
      key
    ] = value * factor;
    rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings[
      key
    ] = value * factor;
  };

  const getRetentionSettingsValue = (key) =>
    rule.ruleBackupDestinations.primaryBackupDestination
      .backupRetentionSettings[key] / factor;

  return (
    <>
      {rule.position !== 0 && (
        <div className="text-right">
          <Button type="button" label="Remove rule" onClick={emitRemoveRule} />
        </div>
      )}

      <ToggleButton
        checked={rule.active}
        onChange={({ value }) => {
          rule.active = value;
          updateBackupDestination();
        }}
      />
      <label className="ml-2">Active</label>

      <Text
        inputValue={rule.name}
        change={({ value }) => (rule.name = value)}
        label="Name *"
      />

      <BackupDestinationComponent
        title="PRIMARY BACKUP DESTINATION"
        policyType={policyType}
        backupDestinationOptions={backupDestinations}
        backupDestination={
          rule.ruleBackupDestinations.primaryBackupDestination.backupDestination
        }
        updateBackupDestination={(e) => {
          updateBackupDestination(e);

          rule.ruleBackupDestinations.primaryBackupDestination.backupDestination =
            e.value;
        }}
        getRetentionSettingsValue={getRetentionSettingsValue}
        setRetentionSettingsValue={setRetentionSettingsValue}
        keepLastBackupWhenSourceStillExists={
          rule.ruleBackupDestinations.primaryBackupDestination
            .backupRetentionSettings.keepLastBackupWhenSourceStillExists
        }
        updateKeepLastBackupWhenSourceStillExists={({ value }) => {
          rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists =
            value;
          updateBackupDestination();
        }}
        retentionKeepLastNFull={
          rule.ruleBackupDestinations.primaryBackupDestination
            .backupRetentionSettings.retentionKeepLastNFull
        }
        updateRetentionKeepLastNFull={({ value }) => {
          rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull =
            value;
        }}
        retentionKeepLastNIncremental={
          rule.ruleBackupDestinations.primaryBackupDestination
            .backupRetentionSettings.retentionKeepLastNIncremental
        }
        updateRetentionKeepLastNIncremental={({ value }) => {
          rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental =
            value;
        }}
      />

      <div className="my-2">
        <ToggleButton
          checked={
            rule.ruleBackupDestinations.secondaryBackupDestination.active
          }
          onChange={({ value: active }) => {
            if (!rule.ruleBackupDestinations.secondaryBackupDestination) {
              rule.ruleBackupDestinations.secondaryBackupDestination =
                new BackupDestinationRule('SECONDARY');
            }
            rule.ruleBackupDestinations.secondaryBackupDestination.active =
              active;

            updateBackupDestinations();
          }}
        />
        <label className="ml-2">Enable Secondary Backup Destination</label>
      </div>
      {rule.ruleBackupDestinations.secondaryBackupDestination?.active && (
        <BackupDestinationComponent
          title="SECONDARY BACKUP DESTINATION"
          selectedBackupDestinationLabel={'Select Secondary Backup Destination'}
          policyType={policyType}
          backupDestinationOptions={backupDestinations.filter(
            ({ guid }) =>
              guid !==
              rule.ruleBackupDestinations.primaryBackupDestination
                .backupDestination.guid,
          )}
          backupDestination={
            rule.ruleBackupDestinations.secondaryBackupDestination
              .backupDestination
          }
          updateBackupDestination={(e) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupDestination =
              e.value;
            updateBackupDestination(e);
          }}
          getRetentionSettingsValue={getRetentionSettingsValue}
          setRetentionSettingsValue={setRetentionSettingsValue}
          keepLastBackupWhenSourceStillExists={
            rule.ruleBackupDestinations.secondaryBackupDestination
              .backupRetentionSettings.keepLastBackupWhenSourceStillExists
          }
          updateKeepLastBackupWhenSourceStillExists={({ value }) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists =
              value;
            updateBackupDestination();
          }}
          retentionKeepLastNFull={
            rule.ruleBackupDestinations.secondaryBackupDestination
              .backupRetentionSettings.retentionKeepLastNFull
          }
          updateRetentionKeepLastNFull={({ value }) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull =
              value;
          }}
          retentionKeepLastNIncremental={
            rule.ruleBackupDestinations.secondaryBackupDestination
              .backupRetentionSettings.retentionKeepLastNIncremental
          }
          updateRetentionKeepLastNIncremental={({ value }) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental =
              value;
          }}
        />
      )}

      <label>Choose schedules</label>
      <ListBox
        value={rule.schedules}
        options={schedules}
        optionLabel="name"
        multiple
        dataKey="guid"
        onChange={({ value }) => {
          rule.schedules = value;
          updateBackupDestination();
        }}
      />
    </>
  );
};
