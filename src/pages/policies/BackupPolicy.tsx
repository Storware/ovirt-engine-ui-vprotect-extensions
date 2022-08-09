import React, {useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import {Button} from 'primereact/button';
import {Accordion, AccordionTab} from 'primereact/accordion';
import {policiesService} from '../../services/policies-service';
import {hypervisorsService} from '../../services/hypervisors-service';
import {virtualMachinesService} from '../../services/virtual-machines-service';
import {mailingService} from '../../services/mailing-list.service';
import {alertService} from '../../services/alert-service';
import {VirtualMachineBackupPolicy} from '../../model/VirtualMachineBackupPolicy';
import {createBrowserHistory} from 'history';
import {BackButton} from '../../utils/backButton';
import {Field, Form, Formik} from 'formik';
import Toggle from 'components/input/reactive/Toggle';
import Text from 'components/input/reactive/Text';
import InputSlider from 'components/input/reactive/InputSlider';
import Select from 'components/input/reactive/Select';
import InputListBox from 'components/input/reactive/InputListBox';
import { RulesContainer } from './rules/RulesContainer';
import { Rule } from '../../model/backup-destination/rule';
import { backupDestinationsService } from '../../services/backup-destinations-service';
import { BackupDestinationRule } from '../../model/backup-destination/backup-destination-rule';
import { AutoAssigment } from 'pages/policies/tabs/auto-assigment/AutoAssigment';

export const BackupPolicy = ({type}) => {
  const history = createBrowserHistory();
  const match = useRouteMatch();
  const [model, setModel] = useState(new VirtualMachineBackupPolicy());
  const [virtualMachines, setVirtualMachines] = useState([]);
  const [hypervisorClusters, setHypervisorClusters] = useState([]);
  const [availableMailingLists, setAvailableMailingLists] = useState([]);
  const [backupDestinations, setBackupDestinations] = useState([]);
  const [filteredBackupDestinations, setFilteredBackupDestinations] = useState(
    [],
  );

  useEffect(() => {
    if (match.params.guid !== 'create') {
      policiesService
        .getPolicy('vm-backup', match.params.guid)
        .then((result) => {
          setModel({
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
                    ({roleType: {name}}) => name === 'SECONDARY',
                ) || new BackupDestinationRule('SECONDARY')
              },
            })),
          });
        });
    }

    backupDestinationsService.getAllBackupDestinations().then((result) => {
      setBackupDestinations(result);
      setFilteredBackupDestinations(result);
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
    model.rules.splice(index, 1);
    model.rules = [...model.rules.map((rule, i) => ({...rule, position: i}))];
    setModel(model);
    handleChangeBackupDestination();
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

  const saveBackupPolicy = async () => {
    const mappedModel = {
      ...model,
      rules: model.rules.map((rule) => ({
        ...rule,
        ruleBackupDestinations: [
          rule.ruleBackupDestinations.primaryBackupDestination,
          ...(rule.ruleBackupDestinations.secondaryBackupDestination
            ? [rule.ruleBackupDestinations.secondaryBackupDestination]
            : []),
        ],
      })),
    };

    if (model.guid) {
      await policiesService.updatePolicy('vm-backup', model.guid, mappedModel);
      alertService.info('Policy updated');
    } else {
      await policiesService.createPolicy('vm-backup', mappedModel);
      alertService.info('Policy created');
    }
    history.back();
  };

  const handleChangeBackupDestination = () => {
    if (!model.rules.length) {
      return;
    }
    setTimeout(() => {
      const _checked = model.rules.flatMap(
        ({
           ruleBackupDestinations: {
             primaryBackupDestination: {backupDestination: pbd},
             secondaryBackupDestination: {backupDestination: sbd} = {
               backupDestination: null,
             },
           },
         }) => [
          ...(pbd?.guid ? [pbd?.guid] : []),
          ...(sbd?.guid ? [sbd?.guid] : []),
        ],
      );

      setFilteredBackupDestinations(_checked);
    });
  };

  const possibleAddRule = () =>
    model.rules.some(
      ({
         ruleBackupDestinations: {
           primaryBackupDestination: {backupDestination: pbd},
           secondaryBackupDestination: {backupDestination: sbd} = {
             backupDestination: null,
           },
         },
       }) => !!pbd === !!pbd?.guid && !!sbd === !!sbd?.guid,
    );

  useEffect(() => {
    handleChangeBackupDestination();
  }, [model.rules]);

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
                  <Field
                    name="mailingList"
                    options={availableMailingLists}
                    component={Select}
                    optionLabel="name"
                    dataKey="name"
                    required
                    label="Select Mailing List"
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
                  type={type}
                />
              </AccordionTab>

              <AccordionTab header="Virtual Environments">
                <Field
                  name="vms"
                  options={virtualMachines}
                  component={InputListBox}
                  optionLabel="name"
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
                    policyType={type}
                    removeRule={() => deleteRule(i)}
                    backupDestinations={backupDestinations}
                    updateBackupDestinations={handleChangeBackupDestination}
                  />
                </AccordionTab>
              ))}

              <AccordionTab header="Other">
                <Field
                  name="failRemainingBackupTasksExportThreshold"
                  component={Toggle}
                  label="Fail rest of the backup tasks if more than X % of EXPORT tasks already failed"
                  onChange={({value}) => {
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
                  onChange={({value}) => {
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
                disabled={!possibleAddRule()}
                label="Add another rule"
                onClick={addAnotherRule}
              />
            </div>

            <div className="d-flex justify-content-between mt-3">
              <div>
                <BackButton/>
              </div>
              <div>
                <Button
                  type="submit"
                  label="Save"
                  className="p-button-success"
                  disabled={!model.name}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
