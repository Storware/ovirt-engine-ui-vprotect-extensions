import React from 'react';
import Select from '../../../components/input/Select';
import Text from '../../../components/input/Text';
import { ToggleButton } from 'primereact/togglebutton';

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
}) => {
  return (
    <div>
      <h6 className="mt-4">{title}</h6>

      <Select
        label="Select Backup Destination"
        optionLabel="name"
        dataKey="guid"
        required={true}
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
              label="Retention (Full) - number of days to keep"
              inputValue={getRetentionSettingsValue(
                'retentionKeepFullNewerThan',
              )}
              change={({ value }) => {
                setRetentionSettingsValue('retentionKeepFullNewerThan', value);
              }}
            />
          </div>

          <div className="mt-2">
            <Text
              label="Retention (Inc.) - number of days to keep"
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
        </div>

        <div
          className="d-flex justify-content-between flex-column"
          style={{ width: '48%' }}
        >
          <div className="mt-2">
            <Text
              inputValue={retentionKeepLastNFull}
              label="Retention (Full) - number of versions to keep"
              change={updateRetentionKeepLastNFull}
            />
          </div>

          <div className="mt-2">
            <Text
              inputValue={retentionKeepLastNIncremental}
              label="Retention (Inc.) - number of versions to keep"
              change={updateRetentionKeepLastNIncremental}
            />
          </div>
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
