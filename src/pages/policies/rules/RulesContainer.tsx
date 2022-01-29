import React, {useEffect, useState} from 'react';
import {backupDestinationsService} from '../../../services/backup-destinations-service';
import {schedulesService} from '../../../services/schedules-service';
import {BackupDestination} from '../../../model/backup-destination/backup-destination';
import Select from '../../../components/input/Select';
import Text from '../../../components/input/Text';
import {InputConvert} from '../../../components/input/InputConvert';
import {ListBox} from 'primereact/listbox';
import {ToggleButton} from 'primereact/togglebutton';
import {Button} from 'primereact/button';

export const RulesContainer = ({rule, backupDestinations, updateFilteredBackupDestinations}) => {
  console.log(rule)
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    schedulesService.getAllTypeSchedules('VM_BACKUP').then((result) => {
      setSchedules(result);
    });
  }, []);

  const updateBackupDestination = (event) => {
    console.log(event)
    // updateFilteredBackupDestinations('Data from child');
    // event.preventDefault();
  }

  return (
    <>
      <div className='text-right'>
        <Button label='Remove rule' />
      </div>

      <Text
        value={rule.name}
        label='Name'
      />

      <div className='d-flex justify-content-between'>
        <div style={{'width': '48%'}} className='mt-2'>
          <Select
            label='Select Primary Backup Destination'
            optionLabel='name'
            dataKey='guid'
            value={rule.ruleBackupDestinations.primaryBackupDestination.backupDestination}
            options={backupDestinations}
            onChange={updateBackupDestination}
          />
        </div>

        <div style={{'width': '48%'}} className='mt-2'>
          <Select
            value={rule.ruleBackupDestinations.secondaryBackupDestination.backupDestination}
            onChange={updateBackupDestination}
            options={backupDestinations}
            optionLabel='name'
            multiple
            dataKey='guid'
            label='Select Secondary Backup Destination'
          />
        </div>
      </div>

      <div className='d-flex justify-content-between'>
        <div style={{'width': '48%'}} className='mt-2'>
          <InputConvert
            factor={24 * 60 * 60 * 1000}
            value={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepFullNewerThan}
            label='Retention (Full) - number of days to keep'
          />
        </div>

        <div style={{'width': '48%'}} className='mt-2'>
          <InputConvert
            factor={24 * 60 * 60 * 1000}
            value={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepIncrementalNewerThan}
            label='Retention (Inc.) - number of days to keep'
          />
        </div>
      </div>

      <div className='d-flex justify-content-between'>
        <div style={{'width': '48%'}} className='mt-2'>
          <Text
            value={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNFull}
            label='Retention (Full) - number of versions to keep'
          />
        </div>

        <div style={{'width': '48%'}} className='mt-2'>
          <Text
            value={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental}
            label='Retention (Inc.) - number of versions to keep'
          />
        </div>
      </div>

      <div className='my-2'>
        <ToggleButton
          checked={rule.ruleBackupDestinations.primaryBackupDestination.backupRetentionSettings.retentionKeepLastNIncremental}
        />
        <label className='ml-2'>Keep last backup when source still exists</label>
      </div>

      <label>Choose schedules</label>
      <ListBox
        value={rule.ruleBackupDestinations.schedules}
        options={schedules} optionLabel='name'
        multiple
        dataKey='guid'
      />
    </>
  )
}
