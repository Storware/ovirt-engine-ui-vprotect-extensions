import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { policiesService } from '../../services/policies-service';
import { hypervisorsService } from '../../services/hypervisors-service';
import { virtualMachinesService } from '../../services/virtual-machines-service';
import { mailingService } from '../../services/mailing-list.service';
import { alertService } from '../../services/alert-service';
import { VirtualMachineBackupPolicy } from '../../model/VirtualMachineBackupPolicy';
import { createBrowserHistory } from 'history';
import { BackButton } from '../../utils/backButton';
import { Field, Form, Formik } from 'formik';
import Toggle from 'components/input/reactive/Toggle';
import Text from 'components/input/reactive/Text';
import InputSlider from 'components/input/reactive/InputSlider';
import InputListBox from 'components/input/reactive/InputListBox';
import { RulesContainer } from './rules/RulesContainer';
import { Rule } from '../../model/backup-destination/rule';
import { backupDestinationsService } from '../../services/backup-destinations-service';
import { BackupDestinationRule } from '../../model/backup-destination/backup-destination-rule';
import { AutoAssigment } from 'pages/policies/tabs/auto-assigment/AutoAssigment';
import Select from 'components/input/Select';

export const BackupPolicy = ({ type }) => {
  const history = createBrowserHistory();
  const match = useRouteMatch();
  const [model, setModel] = useState(new VirtualMachineBackupPolicy());
  const [virtualMachines, setVirtualMachines] = useState([]);
  const [hypervisorClusters, setHypervisorClusters] = useState([]);
  const [availableMailingLists, setAvailableMailingLists] = useState([]);
  const [backupDestinations, setBackupDestinations] = useState([]);
  const [requestInProgress, setRequestInProgress] = useState<boolean>(false);

  useEffect(() => {
    if (match.params.guid !== 'create') {
      policiesService
        .getPolicy('vm-backup', match.params.guid)
        .then((result) => {
          setModel((_model) => ({
            ..._model,
            ...result,
            rules: result.rules.map((rule) => ({
              ...rule,
              ruleBackupDestinations: {
                primaryBackupDestination:
                  rule.ruleBackupDestinations.find(
                    (el) => el.roleType.name === 'PRIMARY',
                  ) || new BackupDestinationRule('PRIMARY'),
                secondaryBackupDestination:
                  rule.ruleBackupDestinations.find(
                    ({ roleType: { name } }) => name === 'SECONDARY',
                  ) || new BackupDestinationRule('SECONDARY'),
              },
            })),
          }));
        });
    }

    backupDestinationsService.getAllBackupDestinations().then((result) => {
      setBackupDestinations(result);
      if (match.params.guid === 'create') {
        const _model = { ...model };
        _model.rules[0].ruleBackupDestinations.primaryBackupDestination.backupDestination =
          result.find((r) => r.defaultBackupDestination) || result[0];
        setModel(_model);
      }
    });

    hypervisorsService.getAllHypervisorClusters().then((result) => {
      setHypervisorClusters(result);
    });

    virtualMachinesService.getVirtualMachines().then((result) => {
      setVirtualMachines(result);
    });

    mailingService.getMailingLists().then((result) => {
      setAvailableMailingLists(result);
    });
  }, []);

  const addAnotherRule = () => {
    setModel({
      ...model,
      rules: [
        ...model.rules,
        {
          ...new Rule(`Rule ${model.rules.length}`),
          position: model.rules.length,
        },
      ],
    });
  };

  const deleteRule = (index) => {
    const _model = { ...model };
    _model.rules.splice(index, 1);
    _model.rules = _model.rules.map((rule, i) => ({ ...rule, position: i }));

    setModel(_model);
  };

  const handle = (name) => (e) => {
    const setNestedValue = (beforeVal, nestedName, val) => {
      const [n, ...restNames] = nestedName.split('.');
      return {
        ...beforeVal,
        [n]:
          restNames.length > 0
            ? setNestedValue(beforeVal[n], restNames.join('.'), val)
            : val,
      };
    };

    setModel(
      setNestedValue(
        model,
        name,
        e.target?.nodeName === 'INPUT' ? e.target.value : e.value,
      ),
    );
  };

  const mapModelToPayload = (backupModel) => ({
    ...backupModel,
    rules: backupModel.rules.map((rule) => ({
      ...rule,
      ruleBackupDestinations: [
        rule.ruleBackupDestinations.primaryBackupDestination,
        ...(rule.ruleBackupDestinations.secondaryBackupDestination
          ? [rule.ruleBackupDestinations.secondaryBackupDestination]
          : []),
      ],
    })),
  });

  const saveBackupPolicy = async () => {
    setRequestInProgress(true);
    const mappedModel = mapModelToPayload(model);

    if (model.guid) {
      try {
        await policiesService.updatePolicy(
          'vm-backup',
          model.guid,
          mappedModel,
        );
        alertService.info('Policy updated');
      } finally {
        setRequestInProgress(false);
      }
    } else {
      try {
        await policiesService.createPolicy('vm-backup', mappedModel);
        alertService.info('Policy created');
      } finally {
        setRequestInProgress(false);
      }
    }
    history.back();
  };

  return (
    <div className="form">
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={saveBackupPolicy}
      >
        {() => (
          <Form>
            <Accordion multiple activeIndex={[0]}>
              <AccordionTab header="General">
                <Field
                  name="name"
                  component={Text}
                  label="Name *"
                  onChange={handle('name')}
                />
                <Field
                  name="active"
                  component={Toggle}
                  label="Scheduled backups enabled"
                  onChange={handle('active')}
                />
                <Field
                  name="autoRemoveNonPresent"
                  component={Toggle}
                  label="Auto remove non-present Virtual Environments"
                  onChange={handle('autoRemoveNonPresent')}
                />
                <Field
                  name="dailyReportEnabled"
                  component={Toggle}
                  label="Send daily backup/restore report for VMs assigned to this policy "
                  onChange={handle('dailyReportEnabled')}
                />
                {model.dailyReportEnabled && (
                  <Select
                    value={model.mailingList}
                    label="Select Mailing List"
                    optionLabel="name"
                    dataKey="name"
                    isRequired={true}
                    options={availableMailingLists}
                    onChange={handle('mailingList')}
                  />
                )}
                <Field
                  name="backupRetryCount"
                  component={InputSlider}
                  label="Retry Count *"
                  onChange={handle('backupRetryCount')}
                />
                <Field
                  name="priority"
                  component={InputSlider}
                  label="Priority *"
                  onChange={handle('priority')}
                />
              </AccordionTab>

              <AccordionTab header="Auto-assigment *">
                <AutoAssigment
                  model={model}
                  setModel={setModel}
                  handle={handle}
                  hypervisorClusters={hypervisorClusters}
                  mapModelToPayload={mapModelToPayload}
                  type={type}
                />
              </AccordionTab>

              <AccordionTab header="Virtual Environments">
                <Field
                  name="vms"
                  options={virtualMachines}
                  component={InputListBox}
                  optionLabel="name"
                  underlinetext="uuid"
                  multiple
                  dataKey="guid"
                  label="Choose Virtual Environments"
                  onChange={handle('vms')}
                />
              </AccordionTab>

              {model.rules.map((rule, i) => (
                <AccordionTab
                  key={rule.name}
                  header={'Rule (' + rule.name + ') *'}
                  headerClassName={
                    !rule.active && 'p-disabled p-disabled-clickable'
                  }
                >
                  <RulesContainer
                    rule={rule}
                    onUpdateRule={(_rule) => {
                      const _model = { ...model };
                      _model.rules[i] = { ..._rule };
                      setModel(_model);
                    }}
                    policyType={type}
                    removeRule={() => deleteRule(i)}
                    backupDestinations={backupDestinations}
                  />
                </AccordionTab>
              ))}

              <AccordionTab header="Other">
                <Field
                  name="failRemainingBackupTasksExportThreshold"
                  component={Toggle}
                  label="Fail rest of the backup tasks if more than X % of EXPORT tasks already failed"
                  onChange={({ value }) => {
                    setModel({
                      ...model,
                      failRemainingBackupTasksExportThreshold: value
                        ? 50
                        : null,
                    });
                  }}
                />
                {!!model.failRemainingBackupTasksExportThreshold && (
                  <Field
                    name="failRemainingBackupTasksExportThreshold"
                    component={InputSlider}
                    label="Percent of already failed EXPORT tasks"
                    onChange={handle('failRemainingBackupTasksExportThreshold')}
                  />
                )}

                <Field
                  name="failRemainingBackupTasksStoreThreshold"
                  component={Toggle}
                  label="Fail rest of the backup tasks if more than X % of STORE tasks already failed"
                  onChange={({ value }) => {
                    setModel({
                      ...model,
                      failRemainingBackupTasksStoreThreshold: value ? 50 : null,
                    });
                  }}
                />
                {!!model.failRemainingBackupTasksStoreThreshold && (
                  <Field
                    name="failRemainingBackupTasksStoreThreshold"
                    component={InputSlider}
                    label="Percent of already failed STORE tasks"
                    onChange={handle('failRemainingBackupTasksStoreThreshold')}
                  />
                )}
              </AccordionTab>
            </Accordion>

            <div className="mt-3">
              <Button
                type="button"
                disabled={backupDestinations.length === 0}
                label="Add another rule"
                onClick={addAnotherRule}
              />
            </div>

            <div className="d-flex justify-content-between mt-3">
              <div>
                <BackButton />
              </div>
              <div>
                <Button
                  type="submit"
                  label="Save"
                  className="p-button-success"
                  disabled={!model.name || requestInProgress}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
