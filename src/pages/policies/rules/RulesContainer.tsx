import React, {useEffect, useState} from 'react';
import {schedulesService} from '../../../services/schedules-service';
import Text from '../../../components/input/Text';
import {ListBox} from 'primereact/listbox';
import {ToggleButton} from 'primereact/togglebutton';
import {Button} from 'primereact/button';
import Select from '../../../components/input/Select';
import {BackupDestination} from '../../../model/backup-destination/backup-destination';
import {NameAndGuid} from '../../../model/dto/nameAndGuid';
import {BackupDestinationRetentionFactory} from '../../../model/backup-destination/backup-destination-retention-factory';

export const RulesContainer = ({rule, filteredBackupDestinations, updateFilteredBackupDestinations, removeRule}) => {
  const [backupDestinationType, setBackupDestinationType] = useState(null);
  const [primaryBackupDestinationOptions, setPrimaryBackupDestinationOptions] = useState(filteredBackupDestinations);
  const [secondaryBackupDestinationOptions, setSecondaryBackupDestinationOptions] = useState(filteredBackupDestinations);
  const [backupDestinationsCopy] = useState(filteredBackupDestinations);
  const [schedules, setSchedules] = useState([]);
  const [factor] = useState(24 * 60 * 60 * 1000);

  // form
  const [keepLastBackupWhenSourceStillExists, setKeepLastBackupWhenSourceStillExists] = useState(false);

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
    setKeepLastBackupWhenSourceStillExists(
      rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists)
  }, [rule]);

  const updateBackupDestination = (event?) => {
    setBackupRetentionSettings();
    updateFilteredBackupDestinations();

    if (event) {
      event.preventDefault();
    }
  }

  const setBackupDestinationOptions = () => {
    if (rule.ruleBackupDestinations.primaryBackupDestination?.backupDestination?.guid) {
      setPrimaryBackupDestinationOptions([
        rule.ruleBackupDestinations.primaryBackupDestination.backupDestination,
        ...filteredBackupDestinations,
      ]);

      setSecondaryBackupDestinationOptions([...filteredBackupDestinations])
    } else {
      setPrimaryBackupDestinationOptions([
        ...filteredBackupDestinations,
      ]);
      setSecondaryBackupDestinationOptions([
        ...filteredBackupDestinations,
      ]);
    }

    if (rule.ruleBackupDestinations.secondaryBackupDestination?.backupDestination?.guid) {
      setSecondaryBackupDestinationOptions([
        rule.ruleBackupDestinations.secondaryBackupDestination.backupDestination,
        ...filteredBackupDestinations,
      ])
    }
  }

  const setBackupRetentionSettings = () => {
    if (!rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull) {
      setTypeAndRetention(rule.ruleBackupDestinations.primaryBackupDestination.backupDestination);
    } else {
      setType(rule.ruleBackupDestinations.primaryBackupDestination.backupDestination);
    }
  }

  const setTypeAndRetention = (selectedBackupDestination: BackupDestination | NameAndGuid) => {
    setType(selectedBackupDestination);
    if (!backupDestinationType) {
      return;
    }

    rule.ruleBackupDestinations.primaryBackupDestination = {
      ...rule.ruleBackupDestinations.primaryBackupDestination,
      backupRetentionSettings: new BackupDestinationRetentionFactory[backupDestinationType](),
    };
    rule.ruleBackupDestinations.secondaryBackupDestination = {
      ...rule.ruleBackupDestinations.secondaryBackupDestination,
      backupRetentionSettings: new BackupDestinationRetentionFactory[backupDestinationType](),
    };
  }

  const setType = (selectedBackupDestination: BackupDestination | NameAndGuid) => {
    if (!backupDestinationsCopy.length) {
      return;
    }
    setBackupDestinationType(backupDestinationsCopy.find(
      ({guid}) => guid === selectedBackupDestination.guid
    )?.type?.name);
  }

  const emitRemoveRule = (event) => {
    removeRule();
    event.preventDefault();
  }

  const setRetentionSettingsValue = (key, value) => {
    rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings[key] = value * factor;
    rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings[key] = value * factor;
  }

  const getRetentionSettingsValue = (key) => {
    return rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings[key] / factor
  }

  return (
    <>
      {rule.position !== 0 &&
      <div className='text-right'>
        <Button type='button' label='Remove rule' onClick={emitRemoveRule}/>
      </div>
      }

      <Text
        inputValue={rule.name}
        change={(e) => rule.name = e.value}
        label='Name'
      />

      <div className='d-flex justify-content-between'>
        <div style={{'width': '48%'}} className='mt-2'>
          <Select
            label='Select Primary Backup Destination'
            optionLabel='name'
            dataKey='guid'
            required={true}
            value={rule.ruleBackupDestinations.primaryBackupDestination.backupDestination}
            options={primaryBackupDestinationOptions}
            onChange={(e) => {
              rule.ruleBackupDestinations.primaryBackupDestination.backupDestination = e.value;
              updateBackupDestination(e);
            }}
          />
        </div>

        <div style={{'width': '48%'}} className='mt-2'>
          <Select
            value={rule.ruleBackupDestinations.secondaryBackupDestination.backupDestination}
            onChange={(e) => {
              rule.ruleBackupDestinations.secondaryBackupDestination.backupDestination = e.value
              updateBackupDestination(e);
            }}
            options={secondaryBackupDestinationOptions}
            optionLabel='name'
            multiple
            dataKey='guid'
            label='Select Secondary Backup Destination'
          />
        </div>
      </div>

      <div className='d-flex justify-content-between'>
        <div style={{'width': '48%'}} className='mt-2'>
          <Text
            label='Retention (Full) - number of days to keep'
            inputValue={getRetentionSettingsValue('retentionKeepFullNewerThan')}
            change={(e) => {
              setRetentionSettingsValue('retentionKeepFullNewerThan', e.value)
            }}/>
        </div>

        <div style={{'width': '48%'}} className='mt-2'>
          <Text
            label='Retention (Inc.) - number of days to keep'
            inputValue={getRetentionSettingsValue('retentionKeepIncrementalNewerThan')}
            change={(e) => {
              setRetentionSettingsValue('retentionKeepIncrementalNewerThan', e.value)
            }}
          />
        </div>
      </div>

      <div className='d-flex justify-content-between'>
        <div style={{'width': '48%'}} className='mt-2'>
          <Text
            inputValue={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull}
            label='Retention (Full) - number of versions to keep'
            change={(e) => {
              rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull = e.value
              rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull = e.value
            }}
          />
        </div>

        <div style={{'width': '48%'}} className='mt-2'>
          <Text
            inputValue={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental}
            label='Retention (Inc.) - number of versions to keep'
            change={(e) => {
              rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental = e.value
              rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental = e.value
            }}
          />
        </div>
      </div>

      <div className='my-2'>
        <ToggleButton
          checked={keepLastBackupWhenSourceStillExists}
          onChange={(e) => {
            setKeepLastBackupWhenSourceStillExists(e.value)
            rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists = e.value
            rule.ruleBackupDestinations.secondaryBackupDestination.backupRetentionSettings.keepLastBackupWhenSourceStillExists = e.value
          }}
        />
        <label className='ml-2'>Keep last backup when source still exists</label>
      </div>

      <label>Choose schedules</label>
      <ListBox
        value={rule.ruleBackupDestinations.schedules}
        options={schedules} optionLabel='name'
        multiple
        dataKey='guid'
        onChange={(e) => {
          rule.ruleBackupDestinations.schedules = e.value
        }}
      />
    </>
  )
}
