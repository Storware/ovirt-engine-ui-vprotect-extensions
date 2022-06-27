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
  policyType,
}) => {
  const [backupDestinationType, setBackupDestinationType] = useState(null);
  const [
    secondaryBackupDestinationToggle,
    setSecondaryBackupDestinationToggle,
  ] = useState(!!rule.ruleBackupDestinations[0].secondaryBackupDestination);
  const [primaryBackupDestinationOptions, setPrimaryBackupDestinationOptions] =
    useState(filteredBackupDestinations);
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
    updateFilteredBackupDestinations();
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
    setTimeout(() => {
      if (!!rule.ruleBackupDestinations[0].primaryBackupDestination) {
        setPrimaryBackupDestinationOptions([
          rule.ruleBackupDestinations[0].primaryBackupDestination
            .backupDestination,
          ...filteredBackupDestinations,
        ]);
      }

      if (!!rule.ruleBackupDestinations[0].secondaryBackupDestination) {
        setSecondaryBackupDestinationOptions([
          rule.ruleBackupDestinations[0].secondaryBackupDestination
            .backupDestination,
          ...filteredBackupDestinations,
        ]);
      }
    });
  };

  const setBackupRetentionSettings = () => {
    if (
      !rule.ruleBackupDestinations[0].primaryBackupDestination
        .backupRetentionSettings.retentionKeepLastNFull
    ) {
      setTypeAndRetention(
        rule.ruleBackupDestinations[0].primaryBackupDestination
          .backupDestination,
      );
    } else {
      setType(
        rule.ruleBackupDestinations[0].primaryBackupDestination
          .backupDestination,
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

    rule.ruleBackupDestinations[0].primaryBackupDestination = {
      ...rule.ruleBackupDestinations[0].primaryBackupDestination,
      backupRetentionSettings: new BackupDestinationRetentionFactory[
        backupDestinationType
      ](),
    };
    if (!!rule.ruleBackupDestinations[0].secondaryBackupDestination) {
      rule.ruleBackupDestinations[0].secondaryBackupDestination = {
        ...rule.ruleBackupDestinations[0].secondaryBackupDestination,
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
    rule.ruleBackupDestinations[0].primaryBackupDestination.backupRetentionSettings[
      key
    ] = value * factor;
    rule.ruleBackupDestinations[0].secondaryBackupDestination.backupRetentionSettings[
      key
    ] = value * factor;
  };

  const getRetentionSettingsValue = (key) =>
    rule.ruleBackupDestinations[0].primaryBackupDestination
      .backupRetentionSettings[key] / factor;

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
        label="Name *"
      />

      <BackupDestinationComponent
        title="PRIMARY BACKUP DESTINATION"
        policyType={policyType}
        backupDestinationOptions={primaryBackupDestinationOptions}
        backupDestination={
          rule.ruleBackupDestinations[0].primaryBackupDestination
            .backupDestination
        }
        updateBackupDestination={(e) => {
          updateBackupDestination(e);

          rule.ruleBackupDestinations[0].primaryBackupDestination.backupDestination =
            e.value;
        }}
        getRetentionSettingsValue={getRetentionSettingsValue}
        setRetentionSettingsValue={setRetentionSettingsValue}
        keepLastBackupWhenSourceStillExists={
          rule.ruleBackupDestinations[0].primaryBackupDestination
            .backupRetentionSettings.keepLastBackupWhenSourceStillExists
        }
        updateKeepLastBackupWhenSourceStillExists={({ value }) => {
          rule.ruleBackupDestinations[0].primaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists =
            value;
          updateBackupDestination();
        }}
        retentionKeepLastNFull={
          rule.ruleBackupDestinations[0].primaryBackupDestination
            .backupRetentionSettings.retentionKeepLastNFull
        }
        updateRetentionKeepLastNFull={({ value }) => {
          rule.ruleBackupDestinations[0].primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull =
            value;
        }}
        retentionKeepLastNIncremental={
          rule.ruleBackupDestinations[0].primaryBackupDestination
            .backupRetentionSettings.retentionKeepLastNIncremental
        }
        updateRetentionKeepLastNIncremental={({ value }) => {
          rule.ruleBackupDestinations[0].primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental =
            value;
        }}
      />

      <div className="my-2">
        <ToggleButton
          checked={secondaryBackupDestinationToggle}
          onChange={({ value }) => {
            delete rule.ruleBackupDestinations[0].secondaryBackupDestination;
            if (value) {
              rule.ruleBackupDestinations[0].secondaryBackupDestination =
                new BackupDestinationRule('SECONDARY');
            }
            updateFilteredBackupDestinations();
            setBackupDestinationOptions();
            setSecondaryBackupDestinationToggle(value);
          }}
        />
        <label className="ml-2">Enable Secondary Backup Destination</label>
      </div>
      {secondaryBackupDestinationToggle && (
        <BackupDestinationComponent
          title="SECONDARY BACKUP DESTINATION"
          selectedBackupDestinationLabel={'Select Secondary Backup Destination'}
          policyType={policyType}
          backupDestinationOptions={secondaryBackupDestinationOptions}
          backupDestination={
            rule.ruleBackupDestinations[0].secondaryBackupDestination
              .backupDestination
          }
          updateBackupDestination={(e) => {
            rule.ruleBackupDestinations[0].secondaryBackupDestination.backupDestination =
              e.value;
            updateBackupDestination(e);
          }}
          getRetentionSettingsValue={getRetentionSettingsValue}
          setRetentionSettingsValue={setRetentionSettingsValue}
          keepLastBackupWhenSourceStillExists={
            rule.ruleBackupDestinations[0].secondaryBackupDestination
              .backupRetentionSettings.keepLastBackupWhenSourceStillExists
          }
          updateKeepLastBackupWhenSourceStillExists={({ value }) => {
            rule.ruleBackupDestinations[0].secondaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists =
              value;
            updateBackupDestination();
          }}
          retentionKeepLastNFull={
            rule.ruleBackupDestinations[0].secondaryBackupDestination
              .backupRetentionSettings.retentionKeepLastNFull
          }
          updateRetentionKeepLastNFull={({ value }) => {
            rule.ruleBackupDestinations[0].secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull =
              value;
          }}
          retentionKeepLastNIncremental={
            rule.ruleBackupDestinations[0].secondaryBackupDestination
              .backupRetentionSettings.retentionKeepLastNIncremental
          }
          updateRetentionKeepLastNIncremental={({ value }) => {
            rule.ruleBackupDestinations[0].secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental =
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
