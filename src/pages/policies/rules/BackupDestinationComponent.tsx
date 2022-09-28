import React, { useEffect, useState } from 'react';
import Select from '../../../components/input/Select';
import Text from '../../../components/input/Text';
import { ToggleButton } from 'primereact/togglebutton';

const enum RetentionStateEnum {
  normal = 'Retention',
  full = 'Retention (Full)',
}

export const BackupDestinationComponent = ({
  title,
  backupDestinationOptions,
  backupDestination,
  updateBackupDestination,
  getRetentionSettingsValue,
  setRetentionSettingsValue,
  keepLastBackupWhenSourceStillExists,
  updateKeepLastBackupWhenSourceStillExists,
  retentionKeepLastNFull,
  updateRetentionKeepLastNFull,
  retentionKeepLastNIncremental,
  updateRetentionKeepLastNIncremental,
  policyType,
  selectedBackupDestinationLabel = 'Select Backup Destination *',
}) => {
  const [retentionState, setRetentionState] = useState<RetentionStateEnum>(
    RetentionStateEnum.normal,
  );

  useEffect(() => {
    if (
      !['SYNTHETICXFS', 'SYNTHETICDDBOOST'].includes(
        backupDestination?.type?.name,
      ) &&
      policyType !== 'cloud-backup'
    ) {
      setRetentionState(RetentionStateEnum.full);
      return;
    }

    setRetentionState(RetentionStateEnum.normal);
  }, [backupDestination]);

  return (
    <div>
      <h6 className="mt-4">{title}</h6>

      <Select
        label={selectedBackupDestinationLabel}
        optionLabel="name"
        dataKey="guid"
        value={backupDestination}
        options={backupDestinationOptions}
        onChange={updateBackupDestination}
      />

      <div className="d-flex justify-content-between">
        <div
          className="d-flex justify-content-between flex-column"
          style={{ width: '48%' }}
        >
          <div className="mt-2">
            <Text
              label={`${retentionState} - number of days to keep *`}
              inputValue={getRetentionSettingsValue(
                'retentionKeepFullNewerThan',
              )}
              change={({ value }) => {
                setRetentionSettingsValue('retentionKeepFullNewerThan', value);
              }}
            />
          </div>

          {retentionState === RetentionStateEnum.full && (
            <div className="mt-2">
              <Text
                label="Retention (Inc.) - number of days to keep *"
                inputValue={getRetentionSettingsValue(
                  'retentionKeepIncrementalNewerThan',
                )}
                change={({ value }) => {
                  setRetentionSettingsValue(
                    'retentionKeepIncrementalNewerThan',
                    value,
                  );
                }}
              />
            </div>
          )}
        </div>

        <div
          className="d-flex justify-content-between flex-column"
          style={{ width: '48%' }}
        >
          <div className="mt-2">
            <Text
              inputValue={retentionKeepLastNFull}
              label={`${retentionState} - number of versions to keep *`}
              change={updateRetentionKeepLastNFull}
            />
          </div>

          {retentionState === RetentionStateEnum.full && (
            <div className="mt-2">
              <Text
                inputValue={retentionKeepLastNIncremental}
                label="Retention (Inc.) - number of versions to keep *"
                change={updateRetentionKeepLastNIncremental}
              />
            </div>
          )}
        </div>
      </div>
      <div className="my-2">
        <ToggleButton
          checked={keepLastBackupWhenSourceStillExists}
          onChange={updateKeepLastBackupWhenSourceStillExists}
        />
        <label className="ml-2">
          Keep last backup when source still exists
        </label>
      </div>
    </div>
  );
};
