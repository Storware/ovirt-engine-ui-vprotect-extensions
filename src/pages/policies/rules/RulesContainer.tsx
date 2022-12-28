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
import { Tooltip } from 'primereact/tooltip';

export const RulesContainer = ({
  rule,
  backupDestinations,
  removeRule,
  policyType,
  onUpdateRule,
}) => {
  const [backupDestinationType, setBackupDestinationType] = useState(null);
  const [backupDestinationsCopy] = useState(backupDestinations);
  const [schedules, setSchedules] = useState([]);
  const [factor] = useState(24 * 60 * 60 * 1000);

  useEffect(() => {
    schedulesService.getAllTypeSchedules('VM_BACKUP').then((result) => {
      setSchedules(result);
    });
    setBackupRetentionSettings();
  }, []);

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
    onUpdateRule(rule);
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
    event.preventDefault();
    removeRule();
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
      <div className="d-flex flex-row justify-content-between">
        <div className="my-2 w-6">
          <ToggleButton
            checked={rule.active}
            onChange={({ value }) => {
              rule.active = value;
              setBackupRetentionSettings();
            }}
          />
          <label className="ml-2">Active</label>
        </div>
        {rule.position !== 0 && (
          <>
            {rule.backupCount > 0 && (
              <Tooltip target=".disabled-remove-rule-button" />
            )}
            <span
              className="disabled-remove-rule-button"
              data-pr-tooltip="Cannot delete rule as it contains backups"
            >
              <Button
                style={{ height: '50px', margin: '10px 25px 0 0' }}
                type="button"
                label="Remove rule"
                disabled={rule.backupCount > 0}
                onClick={emitRemoveRule}
              />
            </span>
          </>
        )}
      </div>
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
        updateBackupDestination={({ value: backupDestination }) => {
          setBackupRetentionSettings();
          rule.ruleBackupDestinations.primaryBackupDestination.backupDestination =
            backupDestination;
          onUpdateRule(rule);
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
          setBackupRetentionSettings();
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

            setBackupRetentionSettings();
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
          updateBackupDestination={({ value: backupDestination }) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupDestination =
              backupDestination;
            onUpdateRule(rule);

            setBackupRetentionSettings();
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
            setBackupRetentionSettings();
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
          setBackupRetentionSettings();
        }}
      />
    </>
  );
};
