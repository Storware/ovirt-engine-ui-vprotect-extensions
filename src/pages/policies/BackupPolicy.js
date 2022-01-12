import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { policiesService } from '../../services/policies-service';
import { hypervisorsService } from '../../services/hypervisors-service';
import { virtualMachinesService } from '../../services/virtual-machines-service';
import { backupDestinationsService } from '../../services/backup-destinations-service';
import { schedulesService } from '../../services/schedules-service';
import { alertService } from '../../services/alert-service';
import { VirtualMachineBackupPolicy } from '../../model/VirtualMachineBackupPolicy';
import { createBrowserHistory } from 'history';
import { BackButton } from '../../utils/backButton';
import { Field, Form, Formik } from 'formik';
import Toggle from 'components/input/reactive/Toggle';
import Text from 'components/input/reactive/Text';
import InputSlider from 'components/input/reactive/InputSlider';
import Select from "components/input/reactive/Select";
import InputChips from "components/input/reactive/InputChips";
import InputListBox from "components/input/reactive/InputListBox";
import { save } from 'store/policy/actions';


const history = createBrowserHistory();

class BackupPolicy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      model: new VirtualMachineBackupPolicy(),
      activeIndex: [0],
    };

    if (this.props.match.params.guid !== 'create') {
      policiesService
        .getPolicy('vm-backup', this.props.match.params.guid)
        .then((result) => {
          this.setState({
            ...this.state,
            model: result,
          });
        });
    }

    hypervisorsService.getAllHypervisorClusters().then((result) => {
      this.setState({
        ...this.state,
        hypervisorClusters: result,
      });
    });

    virtualMachinesService.getVirtualMachines().then((result) => {
      this.setState({
        ...this.state,
        virtualMachines: result,
      });
    });

    backupDestinationsService.getAllBackupDestinations().then((result) => {
      this.setState({
        ...this.state,
        backupDestinations: result,
      });
    });

    schedulesService.getAllTypeSchedules('VM_BACKUP').then((result) => {
      this.setState({
        ...this.state,
        schedules: result,
      });
    });
  }

  handle = (name) => {
    return (e) => {
      this.setState({
        ...this.state,
        model: {
          ...this.state.model,
          [name]:
            e.target && e.target.nodeName === 'INPUT'
              ? e.target.value
              : e.value,
        },
      });
    };
  };

  save = async () => {
    if (this.state.model.guid) {
      await policiesService.updatePolicy(
        'vm-backup',
        this.state.model.guid,
        this.state.model,
      );
      await policiesService.updateRule(
        'vm-backup',
        this.state.model.rules[0].guid,
        this.state.model.rules[0],
      );
      alertService.info('Policy updated');
    } else {
      const policy = await policiesService.createPolicy(
        'vm-backup',
        this.state.model,
      );
      await policiesService.createRule('vm-backup', {
        ...this.state.model.rules[0],
        policy: {
          guid: policy.guid,
        },
      });
      alertService.info('Policy created');
    }
    history.back();
  };

  render() {
    return (
        <div className={'form'}>
          <Formik
              enableReinitialize
              initialValues={this.state.model}
              onSubmit={async (values) => {
                await save(values, 'vm-backup');
                history.back();
              }}
          >
            {() => (
                <Form>
                  <Accordion
                    multiple
                    activeIndex={this.state.activeIndex}
                    onTabChange={(e) => this.setState({ activeIndex: e.index })}
                   >
                    <AccordionTab header="General">
                      <Field name="name" component={Text} label="Name" onChange={this.handle('name')} />
                      <Field
                          name="active"
                          component={Toggle}
                          label="Scheduled backups enabled"
                      />
                      <Field
                          name="autoRemoveNonPresent"
                          component={Toggle}
                          label="Auto remove non-present Virtual Environments"
                      />
                      <Field
                          name="backupRetryCount"
                          component={InputSlider}
                          label="Retry Count"
                      />
                      <Field
                          name="priority"
                          component={InputSlider}
                          label="Priority"
                      />
                    </AccordionTab>

                    <AccordionTab header="Auto-assigment">
                      <Field
                          name="autoAssignSettings.mode"
                          options={policiesService.assignModes}
                          component={Select}
                          optionLabel="description"
                          dataKey="name"
                          required
                          label="Auto-assign Mode"
                      />

                      <h5 className={'mt-3'}>Include rules</h5>
                      <div className={'row'}>
                        <div className={'col'}>
                          <Field
                              name="autoAssignSettings.includeTags"
                              component={InputChips}
                              label="Include TAG based rules"
                          />
                        </div>
                        <div className={'col'}>
                          <Field
                              name="autoAssignSettings.includeRegExps"
                              component={InputChips}
                              label="Include Regex based rules"
                          />
                        </div>
                      </div>

                      <h5 className={'mt-3'}>Exclude rules</h5>
                      <div className={'row'}>
                        <div className={'col'}>
                          <Field
                              name="autoAssignSettings.excludeTags"
                              component={InputChips}
                              label="Exclude TAG based rules"
                          />
                        </div>
                        <div className={'col'}>
                          <Field
                              name="autoAssignSettings.excludeRegExps"
                              component={InputChips}
                              label="Exclude Regex based rules"
                          />
                        </div>
                      </div>

                      <Field
                          name="autoAssignSettings.hvClusters"
                          options={this.state.hypervisorClusters}
                          component={InputListBox}
                          optionLabel="name"
                          multiple
                          dataKey="guid"
                          label="Auto-assign Virtual Environments only if they belong to the following clusters (optional)"
                      />
                    </AccordionTab>

                    <AccordionTab header="Virtual Environments">
                      <Field
                          name="vms"
                          options={this.state.virtualMachines}
                          component={InputListBox}
                          optionLabel="name"
                          multiple
                          dataKey="guid"
                          label="Choose Virtual Environments"
                      />
                    </AccordionTab>

                    <AccordionTab header="Rule">
                      <Field
                          name="this.state.model.rules[0].backupDestinations[0]"
                          options={this.state.backupDestinations}
                          component={InputListBox}
                          optionLabel="name"
                          multiple
                          dataKey="guid"
                          label="Select Backup Destination"
                      />

                      <Field
                          name="this.state.model.rules[0].schedules"
                          options={this.state.schedules}
                          component={InputListBox}
                          optionLabel="name"
                          multiple
                          dataKey="guid"
                          label="Choose schedules"
                      />
                    </AccordionTab>

                    <AccordionTab header="Other">
                      <Field
                          name="failRemainingBackupTasksExportThreshold"
                          component={Toggle}
                          label="Fail rest of the backup tasks if more than X % of EXPORT tasks already failed"
                          onChange={(e) => {
                            this.setState({
                              ...this.state,
                              model: {
                                ...this.state.model,
                                failRemainingBackupTasksExportThreshold: e.value
                                    ? 50
                                    : null,
                              },
                            });
                          }}
                      />
                      {!!this.state.model.failRemainingBackupTasksExportThreshold && (
                          <Field
                              name="failRemainingBackupTasksExportThreshold"
                              component={InputSlider}
                              label="Percent of already failed EXPORT tasks"
                          />
                      )}

                      <Field
                          name="failRemainingBackupTasksStoreThreshold"
                          component={Toggle}
                          label="Fail rest of the backup tasks if more than X % of STORE tasks already failed"
                          onChange={(e) => {
                            this.setState({
                              ...this.state,
                              model: {
                                ...this.state.model,
                                failRemainingBackupTasksStoreThreshold: e.value
                                    ? 50
                                    : null,
                              },
                            });
                          }}
                      />
                      {!!this.state.model.failRemainingBackupTasksStoreThreshold && (
                          <Field
                              name="failRemainingBackupTasksStoreThreshold"
                              component={InputSlider}
                              label="Percent of already failed STORE tasks"
                          />
                      )}
                    </AccordionTab>
                  </Accordion>

                  <div className="d-flex justify-content-between mt-3">
                    <div>
                      <BackButton />
                    </div>
                    <div>
                      <Button
                          type="submit"
                          label="Save"
                          className="p-button-success"
                          disabled={!this.state.model.name}
                      />
                    </div>
                  </div>
                </Form>
            )}

          </Formik>
        </div>
    );
  }
}

BackupPolicy.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(BackupPolicy);
