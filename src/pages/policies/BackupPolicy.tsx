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
import InputChips from 'components/input/reactive/InputChips';
import InputListBox from 'components/input/reactive/InputListBox';
import {RulesContainer} from './rules/RulesContainer';
import {Rule} from '../../model/backup-destination/rule';
import {backupDestinationsService} from '../../services/backup-destinations-service';
import {BackupDestinationRule} from '../../model/backup-destination/backup-destination-rule';

export const BackupPolicy = () => {
  const history = createBrowserHistory();
  const match = useRouteMatch();
  const [model, setModel] = useState(new VirtualMachineBackupPolicy());
  const [virtualMachines, setVirtualMachines] = useState([]);
  const [hypervisorClusters, setHypervisorClusters] = useState([]);
  const [availableMailingLists, setAvailableMailingLists] = useState([]);
  const [backupDestinations, setBackupDestinations] = useState([]);
  const [filteredBackupDestinations, setFilteredBackupDestinations] = useState([]);

  useEffect(() => {
    if (match.params.guid !== 'create') {
      policiesService.getPolicy('vm-backup', match.params.guid)
        .then((result) => {
          setModel({
            ...result, rules: result.rules.map(rule => {
              return {
                ...rule, ruleBackupDestinations: {
                  primaryBackupDestination: rule.ruleBackupDestinations.find(el => el.roleType.name === 'PRIMARY')
                    || new BackupDestinationRule('PRIMARY'),
                  secondaryBackupDestination: rule.ruleBackupDestinations.find(el => el.roleType.name === 'SECONDARY')
                    || new BackupDestinationRule('SECONDARY'),
                }
              }
            })
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
      setAvailableMailingLists(result)
    });
  }, []);

  const addAnotherRule = () => {
    setModel({
      ...this.state.model,
      rules: [
        ...this.state.model.rules,
        {...new Rule(`Rule ${this.state.model.rules.length}`), position: this.state.model.rules.length},
      ],
    });
  }

  const handle = (name) => {
    return (e) => {
      setModel({
        ...model,
        [name]:
          e.target && e.target.nodeName === 'INPUT'
            ? e.target.value
            : e.value,
      });
    };
  };

  const saveBackupPolicy = async () => {
    if (model.guid) {
      await policiesService.updatePolicy('vm-backup', model.guid, model);
      alertService.info('Policy updated');
    } else {
      await policiesService.createPolicy('vm-backup', model);
      alertService.info('Policy created');
    }
    history.back();
  };

  const handleChangeBackupDestination = (childData) => {
    if (!model.rules.length) {
      return;
    }

    const _ruleBackupDestinations = model.rules.map(({ruleBackupDestinations}) =>
      ruleBackupDestinations.map((el) => el?.backupDestination?.guid)
    );

    setFilteredBackupDestinations(backupDestinations.filter(
      ({guid}) =>
        !_ruleBackupDestinations.some(([primaryGuid, secondaryGuid]) => guid === primaryGuid || guid === secondaryGuid)
    ));
  }

  return (
    <div className={'form'}>
      <Formik
        enableReinitialize
        initialValues={model}
        onSubmit={async () => await saveBackupPolicy}
      >
        {() => (
          <Form>
            <Accordion
              multiple
              activeIndex={[0]}
            >
              <AccordionTab header='General'>
                <Field name='name' component={Text} label='Name' onChange={handle('name')}/>
                <Field
                  name='active'
                  component={Toggle}
                  label='Scheduled backups enabled'
                  onChange={handle('active')}
                />
                <Field
                  name='mailingList'
                  component={Toggle}
                  label='Send daily backup/restore report for VMs assigned to this policy '
                  onChange={handle('mailingList')}
                />
                {model.mailingList &&
                (
                  <Field
                    name='mailingList'
                    options={availableMailingLists}
                    component={Select}
                    optionLabel='name'
                    dataKey='name'
                    required
                    label='Select Mailing List'
                  />
                )
                }
                <Field
                  name='backupRetryCount'
                  component={InputSlider}
                  label='Retry Count'
                  onChange={handle('backupRetryCount')}
                />
                <Field
                  name='priority'
                  component={InputSlider}
                  label='Priority'
                  onChange={handle('priority')}
                />
              </AccordionTab>

              <AccordionTab header='Auto-assigment'>
                <Field
                  name='autoAssignSettings.mode'
                  options={policiesService.assignModes}
                  component={Select}
                  optionLabel='description'
                  dataKey='name'
                  required
                  label='Auto-assign Mode'
                  change={(e) => {
                    setModel({
                      ...model,
                      autoAssignSettings: {
                        ...model.autoAssignSettings,
                        mode: e.value,
                      }
                    })
                  }}
                />

                <h5 className={'mt-3'}>Include rules</h5>
                <div className={'row'}>
                  <div className={'col'}>
                    <Field
                      name='autoAssignSettings.includeTags'
                      component={InputChips}
                      label='Include TAG based rules'
                      value={model.autoAssignSettings.includeTags}
                    />
                  </div>
                  <div className={'col'}>
                    <Field
                      name='autoAssignSettings.includeRegExps'
                      component={InputChips}
                      label='Include Regex based rules'
                      value={model.autoAssignSettings.includeRegExps}
                    />
                  </div>
                </div>

                <h5 className={'mt-3'}>Exclude rules</h5>
                <div className={'row'}>
                  <div className={'col'}>
                    <Field
                      name='autoAssignSettings.excludeTags'
                      component={InputChips}
                      label='Exclude TAG based rules'
                      value={model.autoAssignSettings.excludeTags}
                    />
                  </div>
                  <div className={'col'}>
                    <Field
                      name='autoAssignSettings.excludeRegExps'
                      component={InputChips}
                      label='Exclude Regex based rules'
                      value={model.autoAssignSettings.excludeRegExps}
                    />
                  </div>
                </div>

                <Field
                  name='autoAssignSettings.hvClusters'
                  options={hypervisorClusters}
                  component={InputListBox}
                  optionLabel='name'
                  multiple
                  dataKey='guid'
                  onChange={(e) => {
                    setModel({
                      ...model,
                      autoAssignSettings: {
                        ...model.autoAssignSettings,
                        hvClusters: e.target && e.target.nodeName === 'INPUT'
                          ? e.target.value
                          : e.value,
                      }
                    });
                  }}
                  label='Auto-assign Virtual Environments only if they belong to the following clusters (optional)'
                />
              </AccordionTab>

              <AccordionTab header='Virtual Environments'>
                <Field
                  name='vms'
                  options={virtualMachines}
                  component={InputListBox}
                  optionLabel='name'
                  multiple
                  dataKey='guid'
                  label='Choose Virtual Environments'
                  onChange={handle('vms')}
                />
              </AccordionTab>

              {model.rules.map((rule, i) => {
                return (
                  <AccordionTab key={rule.name} header={'Rule (' + rule.name + ')'}>
                    <RulesContainer
                      rule={rule}
                      backupDestinations={filteredBackupDestinations}
                      updateFilteredBackupDestinations={handleChangeBackupDestination}/>
                  </AccordionTab>)
              })}

              <AccordionTab header='Other'>
                <Field
                  name='failRemainingBackupTasksExportThreshold'
                  component={Toggle}
                  label='Fail rest of the backup tasks if more than X % of EXPORT tasks already failed'
                  onChange={(e) => {
                    setModel({
                      ...model,
                      failRemainingBackupTasksExportThreshold: e.value
                        ? 50
                        : null,
                    });
                  }}
                />
                {!!model.failRemainingBackupTasksExportThreshold && (
                  <Field
                    name='failRemainingBackupTasksExportThreshold'
                    component={InputSlider}
                    label='Percent of already failed EXPORT tasks'
                    onChange={handle('failRemainingBackupTasksExportThreshold')}
                  />
                )}

                <Field
                  name='failRemainingBackupTasksStoreThreshold'
                  component={Toggle}
                  label='Fail rest of the backup tasks if more than X % of STORE tasks already failed'
                  onChange={(e) => {
                    setModel({
                      ...model,
                      failRemainingBackupTasksStoreThreshold: e.value
                        ? 50
                        : null,
                    });
                  }}
                />
                {!!model.failRemainingBackupTasksStoreThreshold && (
                  <Field
                    name='failRemainingBackupTasksStoreThreshold'
                    component={InputSlider}
                    label='Percent of already failed STORE tasks'
                    onChange={handle('failRemainingBackupTasksStoreThreshold')}
                  />
                )}
              </AccordionTab>
            </Accordion>

            <div className='mt-3'>
              <Button type='button' label='Add another rule' onClick={addAnotherRule}/>
            </div>

            <div className='d-flex justify-content-between mt-3'>
              <div>
                <BackButton/>
              </div>
              <div>
                <Button
                  type='submit'
                  label='Save'
                  className='p-button-success'
                  disabled={!model.name}
                />
              </div>
            </div>
          </Form>
        )}

      </Formik>
    </div>
  );
}
