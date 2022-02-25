import React, { useEffect, useState } from 'react';
import { schedulesService } from '../../../services/schedules-service';
import Text from '../../../components/input/Text';
import { ListBox } from 'primereact/listbox';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { BackupDestination } from '../../../model/backup-destination/backup-destination';
import { NameAndGuid } from '../../../model/dto/nameAndGuid';
import { BackupDestinationRetentionFactory } from '../../../model/backup-destination/backup-destination-retention-factory';
import { BackupDestinationComponent } from './BackupDestinationComponent';
import { BackupDestinationRule } from '../../../model/backup-destination/backup-destination-rule';

export const RulesContainer = ({
  rule,
  filteredBackupDestinations,
  updateFilteredBackupDestinations,
  removeRule,
}) => {
  const [backupDestinationType, setBackupDestinationType] = useState(null);
  const [
    secondaryBackupDestinationToggle,
    setSecondaryBackupDestinationToggle,
  ] = useState(!!rule.ruleBackupDestinations.secondaryBackupDestination);
  const [
    primaryBackupDestinationOptions,
    setPrimaryBackupDestinationOptions,
  ] = useState(filteredBackupDestinations);
  const [
    secondaryBackupDestinationOptions,
    setSecondaryBackupDestinationOptions,
  ] = useState(filteredBackupDestinations);
  const [backupDestinationsCopy] = useState(filteredBackupDestinations);
  const [schedules, setSchedules] = useState([]);
  const [factor] = useState(24 * 60 * 60 * 1000);

  useEffect(() => {
    schedulesService.getAllTypeSchedules('VM_BACKUP').then((result) => {
      setSchedules(result);
    });
  }, []);

  useEffect(() => {
    setBackupDestinationOptions();
  }, [filteredBackupDestinations]);

  useEffect(() => {
    updateBackupDestination();
  }, [rule]);

  const updateBackupDestination = (event?) => {
    setBackupRetentionSettings();
    updateFilteredBackupDestinations();

    event?.preventDefault();
  };

  const setBackupDestinationOptions = () => {
    if (!!rule.ruleBackupDestinations.primaryBackupDestination) {
      setPrimaryBackupDestinationOptions([
        rule.ruleBackupDestinations.primaryBackupDestination.backupDestination,
        ...filteredBackupDestinations,
      ]);
    }
    setTimeout(() => {
      if (!!rule.ruleBackupDestinations.secondaryBackupDestination) {
        setSecondaryBackupDestinationOptions([
          rule.ruleBackupDestinations.secondaryBackupDestination
            .backupDestination,
          ...filteredBackupDestinations,
        ]);
      }
    });
  };

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

  const getRetentionSettingsValue = (key) => {
    return (
      rule.ruleBackupDestinations.primaryBackupDestination
        .backupRetentionSettings[key] / factor
    );
  };

  // @ts-ignore
  return (
    <>
      {rule.position !== 0 && (
        <div className="text-right">
          <Button type="button" label="Remove rule" onClick={emitRemoveRule} />
        </div>
      )}

      <Text
        inputValue={rule.name}
        change={({ value }) => (rule.name = value)}
        label="Name"
      />

      <BackupDestinationComponent
        title="PRIMARY BACKUP DESTINATION"
        backupDestinationOptions={primaryBackupDestinationOptions}
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
          rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists = value;
          updateBackupDestination();
        }}
        retentionKeepLastNFull={
          rule.ruleBackupDestinations.primaryBackupDestination
            .backupRetentionSettings.retentionKeepLastNFull
        }
        updateRetentionKeepLastNFull={({ value }) => {
          rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull = value;
        }}
        retentionKeepLastNIncremental={
          rule.ruleBackupDestinations.primaryBackupDestination
            .backupRetentionSettings.retentionKeepLastNIncremental
        }
        updateRetentionKeepLastNIncremental={({ value }) => {
          rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental = value;
        }}
      />

      <div className="my-2">
        <ToggleButton
          checked={secondaryBackupDestinationToggle}
          onChange={({ value }) => {
            delete rule.ruleBackupDestinations.secondaryBackupDestination;
            if (value) {
              rule.ruleBackupDestinations.secondaryBackupDestination = new BackupDestinationRule(
                'SECONDARY',
              );
            }
            setBackupDestinationOptions();
            setSecondaryBackupDestinationToggle(value);
          }}
        />
        <label className="ml-2">Enable Secondary Backup Destination</label>
      </div>
      {secondaryBackupDestinationToggle && (
        <BackupDestinationComponent
          title="SECONDARY BACKUP DESTINATION"
          backupDestinationOptions={secondaryBackupDestinationOptions}
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
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists = value;
            updateBackupDestination();
          }}
          retentionKeepLastNFull={
            rule.ruleBackupDestinations.secondaryBackupDestination
              .backupRetentionSettings.retentionKeepLastNFull
          }
          updateRetentionKeepLastNFull={({ value }) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull = value;
          }}
          retentionKeepLastNIncremental={
            rule.ruleBackupDestinations.secondaryBackupDestination
              .backupRetentionSettings.retentionKeepLastNIncremental
          }
          updateRetentionKeepLastNIncremental={({ value }) => {
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental = value;
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
