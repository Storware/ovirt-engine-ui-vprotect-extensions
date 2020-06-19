import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import { Slider } from 'primereact/slider';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { policiesService } from '../../../services/policies-service';
import { hypervisorsService } from '../../../services/hypervisors-service';
import { virtualMachinesService } from '../../../services/virtual-machines-service';
import { backupDestinationsService } from '../../../services/backup-destinations-service';
import { schedulesService } from '../../../services/schedules-service';
import { alertService } from '../../../services/alert-service';
import { VirtualMachineBackupPolicy } from '../../../model/VirtualMachineBackupPolicy';

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
              : e.value && e.target,
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
  };

  render() {
    return (
      <div className={'form'}>
        <Accordion
          multiple
          activeIndex={this.state.activeIndex}
          onTabChange={(e) => this.setState({ activeIndex: e.index })}
        >
          <AccordionTab header="General">
            <div>
              <h3>Name</h3>
              <InputText
                value={this.state.model.name}
                onChange={this.handle('name')}
              />
            </div>
            <div className={'pt-2'}>
              <h3>Auto remove non-present Virtual Environments</h3>
              <ToggleButton
                checked={this.state.model.autoRemoveNonPresent}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    model: {
                      ...this.state.model,
                      autoRemoveNonPresent: e.value,
                    }
                  })
                }}
              />
            </div>
            <div className={'pt-2'}>
              <h3>Priority</h3>
              <InputText
                value={this.state.model.priority}
                type="number"
                onChange={this.handle('priority')}
              />
              <Slider
                value={this.state.model.priority}
                onChange={this.handle('priority')}
              />
            </div>
          </AccordionTab>
          <AccordionTab header="Auto-assigment">
            <h3>Auto-assign Mode</h3>
            <Dropdown
              value={this.state.model.autoAssignSettings.mode}
              optionLabel="description"
              dataKey="name"
              options={policiesService.assignModes}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  model: {
                    ...this.state.model,
                    autoAssignSettings: {
                      ...this.state.model.autoAssignSettings,
                      mode: e.value,
                    },
                  },
                });
              }}
            />

            <div>
              <h3>Include rules</h3>
              <div className={'d-flex'}>
                <div className={'col'}>
                  <h4>Include TAG based rules</h4>
                  <Chips
                    value={this.state.model.autoAssignSettings.includeTags}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        model: {
                          ...this.state.model,
                          autoAssignSettings: {
                            ...this.state.model.autoAssignSettings,
                            includeTags: e.value,
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div className={'col'}>
                  <h4>Include Regex based rules</h4>
                  <Chips
                    value={this.state.model.autoAssignSettings.includeRegExps}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        model: {
                          ...this.state.model,
                          autoAssignSettings: {
                            ...this.state.model.autoAssignSettings,
                            includeRegExps: e.value,
                          },
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3>Exclude rules</h3>
              <div className={'d-flex'}>
                <div className={'col'}>
                  <h4>Exclude TAG based rules</h4>
                  <Chips
                    value={this.state.model.autoAssignSettings.excludeTags}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        model: {
                          ...this.state.model,
                          autoAssignSettings: {
                            ...this.state.model.autoAssignSettings,
                            excludeTags: e.value,
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div className={'col'}>
                  <h4>Exclude Regex based rules</h4>
                  <Chips
                    value={this.state.model.autoAssignSettings.excludeRegExps}
                    onChange={(e) => {
                      this.setState({
                        ...this.state,
                        model: {
                          ...this.state.model,
                          autoAssignSettings: {
                            ...this.state.model.autoAssignSettings,
                            excludeRegExps: e.value,
                          },
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3>
                Auto-assign Virtual Environments only if they belong to the
                following clusters (optional)
              </h3>
              <ListBox
                multiple
                optionLabel="name"
                dataKey="guid"
                value={this.state.model.autoAssignSettings.hvClusters}
                options={this.state.hypervisorClusters}
                className={'w-100'}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    model: {
                      ...this.state.model,
                      autoAssignSettings: {
                        ...this.state.model.autoAssignSettings,
                        hvClusters: e.value,
                      },
                    },
                  });
                }}
              />
            </div>
          </AccordionTab>
          <AccordionTab header="Virtual Environments">
            <div>
              <h3>Choose Virtual Environments</h3>
              <ListBox
                multiple
                filter
                dataKey="guid"
                optionLabel="name"
                value={this.state.model.vms}
                className={'w-100'}
                options={this.state.virtualMachines}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    model: {
                      ...this.state.model,
                      vms: e.value,
                    },
                  });
                }}
              />
            </div>
          </AccordionTab>
          <AccordionTab header="Rule">
            <div>
              <h3>Select Backup Destination</h3>
              <Dropdown
                value={this.state.model.rules[0].backupDestinations[0]}
                optionLabel="name"
                dataKey="guid"
                options={this.state.backupDestinations}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    model: {
                      ...this.state.model,
                      rules: [
                        {
                          ...this.state.model.rules[0],
                          backupDestinations: [e.value],
                        },
                      ],
                    },
                  });
                }}
              />
            </div>
            <div>
              <h3>Choose schedules</h3>
              <ListBox
                multiple
                optionLabel="name"
                dataKey="guid"
                value={this.state.model.rules[0].schedules}
                className={'w-100'}
                options={this.state.schedules}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    model: {
                      ...this.state.model,
                      rules: [
                        {
                          ...this.state.model.rules[0],
                          schedules: e.value,
                        },
                      ],
                    },
                  });
                }}
              />
            </div>
          </AccordionTab>
          <AccordionTab header="Other">
            <div>
              <h3>
                Fail rest of the backup tasks if more than X % of EXPORT tasks
                already failed
              </h3>
              <ToggleButton
                checked={
                  !!this.state.model.failRemainingBackupTasksExportThreshold
                }
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
                <div>
                  <h3>Percent of already failed EXPORT tasks</h3>
                  <InputText
                    value={
                      this.state.model.failRemainingBackupTasksExportThreshold
                    }
                    type="number"
                    onChange={this.handle(
                      'failRemainingBackupTasksExportThreshold',
                    )}
                  />
                  <Slider
                    value={
                      this.state.model.failRemainingBackupTasksExportThreshold
                    }
                    onChange={this.handle(
                      'failRemainingBackupTasksExportThreshold',
                    )}
                  />
                </div>
              )}
            </div>
            <div>
              <h3>
                Fail rest of the backup tasks if more than X % of STORE tasks
                already failed
              </h3>
              <ToggleButton
                checked={
                  !!this.state.model.failRemainingBackupTasksStoreThreshold
                }
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
                <div>
                  <h3>Percent of already failed STORE tasks</h3>
                  <InputText
                    value={
                      this.state.model.failRemainingBackupTasksStoreThreshold
                    }
                    type="number"
                    onChange={this.handle(
                      'failRemainingBackupTasksStoreThreshold',
                    )}
                  />
                  <Slider
                    value={
                      this.state.model.failRemainingBackupTasksStoreThreshold
                    }
                    onChange={this.handle(
                      'failRemainingBackupTasksStoreThreshold',
                    )}
                  />
                </div>
              )}
            </div>
          </AccordionTab>
        </Accordion>
        <div className="d-flex justify-content-between mt-3">
          <div>
            <Link to={`/policies/list/vm-backup`}>
              <Button label="Back" />
            </Link>
          </div>
          <div>
            <Button
              label="Save"
              className="p-button-success"
              onClick={this.save}
            />
          </div>
        </div>
      </div>
    );
  }
}

BackupPolicy.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(BackupPolicy);
