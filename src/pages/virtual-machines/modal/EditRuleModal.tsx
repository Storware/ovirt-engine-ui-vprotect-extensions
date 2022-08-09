import React, {useState} from 'react';
import {hideModalAction} from 'store/modal/actions';
import {useDispatch} from 'react-redux';
import {alertService} from 'services/alert-service';
import Text from 'components/input/Text';
import {ToggleButton} from 'primereact/togglebutton';
import {BackupDestinationRule} from 'model/backup-destination/backup-destination-rule';
import {Button} from 'primereact/button';
import {policiesService} from 'services/policies-service';

export const EditRuleModal = ({rule, primaryBackupDestination, secondaryBackupDestination}) => {
  const dispatch = useDispatch();
  const [factor] = useState(24 * 60 * 60 * 1000);
  const [primaryBackupDestinationModel, setPrimaryBackupDestination] = useState<BackupDestinationRule>(primaryBackupDestination);
  const [secondaryBackupDestinationModel, setSecondaryBackupDestination] = useState<BackupDestinationRule>(secondaryBackupDestination);

  const getRetentionSettingsValue = (ruleBackupDestination, key) =>
    ruleBackupDestination.backupRetentionSettings[key] / factor;

  const setRetentionSettingsValue = (ruleBackupDestination, key, value) => {
    ruleBackupDestination.backupRetentionSettings[key] = value * factor;
  };

  const getUpdatedRetentionSettingsValue = (ruleBackupDestination, field, value) => ({
      ...ruleBackupDestination,
      backupRetentionSettings: {
        ...ruleBackupDestination.backupRetentionSettings,
        [field]: value
      },
    }
  )

  const updateRetentionSettings = async () => {
    await policiesService.updateRule(rule.guid, {
      ...rule,
      ruleBackupDestinations: [
        primaryBackupDestinationModel,
        ...(secondaryBackupDestinationModel
          ? [secondaryBackupDestinationModel]
          : []
        )
      ]
    })
    alertService.info('Retention settings updated');
    dispatch(hideModalAction())
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div
          className="d-flex justify-content-between flex-column"
          style={{width: '48%'}}
        >
          <div className="mt-2">
            <Text
              label={`Retention (Full) - number of days to keep *`}
              inputValue={getRetentionSettingsValue(primaryBackupDestinationModel,
                'retentionKeepFullNewerThan',
              )}
              change={({value}) => {
                setRetentionSettingsValue(primaryBackupDestinationModel,
                  'retentionKeepFullNewerThan', value)
              }}
            />
          </div>

          <div className="mt-2">
            <Text
              label="Retention (Inc.) - number of days to keep *"
              inputValue={getRetentionSettingsValue(primaryBackupDestinationModel,
                'retentionKeepIncrementalNewerThan',
              )}
              change={({value}) => {
                setRetentionSettingsValue(primaryBackupDestinationModel,
                  'retentionKeepIncrementalNewerThan', value)
              }}
            />
          </div>
        </div>

        <div
          className="d-flex justify-content-between flex-column"
          style={{width: '48%'}}
        >
          <div className="mt-2">
            <Text
              label={`Retention (Full) - number of versions to keep *`}
              inputValue={primaryBackupDestinationModel.backupRetentionSettings.retentionKeepLastNFull}
              type="number"
              change={({value}) => {
                setPrimaryBackupDestination({
                  ...primaryBackupDestinationModel,
                  backupRetentionSettings: {
                    ...primaryBackupDestinationModel.backupRetentionSettings,
                    retentionKeepLastNFull: value as any
                  }
                })
              }}
            />
          </div>

          <div className="mt-2">
            <Text
              label="Retention (Inc.) - number of versions to keep *"
              inputValue={primaryBackupDestinationModel.backupRetentionSettings.retentionKeepLastNIncremental}
              type="number"
              change={({value}) => {
                setPrimaryBackupDestination({
                  ...primaryBackupDestinationModel,
                  backupRetentionSettings: {
                    ...primaryBackupDestinationModel.backupRetentionSettings,
                    retentionKeepLastNIncremental: value as any
                  }
                })
              }}
            />
          </div>
        </div>
      </div>
      <div className="my-2">
        <ToggleButton
          checked={primaryBackupDestinationModel.backupRetentionSettings.keepLastBackupWhenSourceStillExists}
          onChange={(e) => {
            setPrimaryBackupDestination(getUpdatedRetentionSettingsValue(primaryBackupDestinationModel,
              'keepLastBackupWhenSourceStillExists', e.value))
          }}
        />
        <label className="ml-2">
          Keep last backup when source still exists
        </label>
      </div>


      {/* SECONDARY */}
      {secondaryBackupDestination && (
        <>
          <div className="d-flex justify-content-between">
            <div
              className="d-flex justify-content-between flex-column"
              style={{width: '48%'}}
            >
              <div className="mt-2">
                <Text
                  label={`Retention (Full) - number of days to keep *`}
                  inputValue={getRetentionSettingsValue(secondaryBackupDestinationModel,
                    'retentionKeepFullNewerThan',
                  )}
                  change={({value}) => {
                    setRetentionSettingsValue(secondaryBackupDestinationModel,
                      'retentionKeepFullNewerThan', value)
                  }}
                />
              </div>

              <div className="mt-2">
                <Text
                  label="Retention (Inc.) - number of days to keep *"
                  inputValue={getRetentionSettingsValue(secondaryBackupDestinationModel,
                    'retentionKeepIncrementalNewerThan',
                  )}
                  change={({value}) => {
                    setRetentionSettingsValue(secondaryBackupDestinationModel,
                      'retentionKeepIncrementalNewerThan', value)
                  }}
                />
              </div>
            </div>

            <div
              className="d-flex justify-content-between flex-column"
              style={{width: '48%'}}
            >
              <div className="mt-2">
                <Text
                  label={`Retention (Full) - number of versions to keep *`}
                  inputValue={secondaryBackupDestinationModel.backupRetentionSettings.retentionKeepLastNFull}
                  type="number"
                  change={({value}) => {
                    setSecondaryBackupDestination({
                      ...secondaryBackupDestinationModel,
                      backupRetentionSettings: {
                        ...secondaryBackupDestinationModel.backupRetentionSettings,
                        retentionKeepLastNFull: value as any
                      }
                    })
                  }}
                />
              </div>

              <div className="mt-2">
                <Text
                  label="Retention (Inc.) - number of versions to keep *"
                  inputValue={secondaryBackupDestinationModel.backupRetentionSettings.retentionKeepLastNIncremental}
                  type="number"
                  change={({value}) => {
                    setSecondaryBackupDestination({
                      ...secondaryBackupDestinationModel,
                      backupRetentionSettings: {
                        ...secondaryBackupDestinationModel.backupRetentionSettings,
                        retentionKeepLastNIncremental: value as any
                      }
                    })
                  }}
                />
              </div>
            </div>
          </div>
          <div className="my-2">
            <ToggleButton
              checked={secondaryBackupDestinationModel.backupRetentionSettings.keepLastBackupWhenSourceStillExists}
              onChange={(e) => {
                setSecondaryBackupDestination(getUpdatedRetentionSettingsValue(secondaryBackupDestinationModel,
                  'keepLastBackupWhenSourceStillExists', e.value))
              }}
            />
            <label className="ml-2">
              Keep last backup when source still exists
            </label>
          </div>
        </>
      )}
      <div className="mt-2 d-flex justify-content-end">
        <Button
          onClick={updateRetentionSettings}
          className="p-button-outlined"
          label="Save"
        />
      </div>
    </>
  );
};
