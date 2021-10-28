import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPolicies,
  selectSnapshotPolicies,
  selectVirtualMachine,
} from '../../../store/virtual-machine/selectors';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { policiesService } from '../../../services/policies-service';
import { alertService } from '../../../services/alert-service';
import {
  virtualMachinesService,
  preAndPostSnapStdErrorHandlingOptions,
} from '../../../services/virtual-machines-service';
import { ToggleButton } from 'primereact/togglebutton';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';
import { Button } from 'primereact/button';
import { createBrowserHistory } from 'history';

const isBaseImageConfigAvailable = (model) => {
  return model.hvmType != null && model.hvmType.name === 'AWS';
};

const inheritableBooleanValues = [
  { name: 'TRUE', description: 'True' },
  { name: 'FALSE', description: 'False' },
  { name: 'INHERIT', description: 'Inherit' },
];

const Settings = () => {
  const [model, setModel] = useState(useSelector(selectVirtualMachine));
  const [activeIndex, setActiveIndex] = useState({
    first: [0],
    second: [],
  });
  const [sshPassword, setSshPassword] = useState({
    first: '',
    second: '',
  });

  const policies = useSelector(selectPolicies);
  const snapshotPolicies = useSelector(selectSnapshotPolicies);
  const modes = virtualMachinesService.getVirtualMachineExportImportModes(
    model,
  );
  const history = createBrowserHistory();

  const save = async () => {
    await virtualMachinesService.updateVirtualMachineSettings(model);
    alertService.info('Virtual machine has been updated');
  };

  const savePassword = async () => {
    await virtualMachinesService.updateVmSshPassword(
      model.guid,
      sshPassword.first,
    );
    alertService.info('Password updated');
  };

  return (
    <div className="form">
      <Accordion
        multiple
        activeIndex={activeIndex.first}
        onTabChange={(e) =>
          setActiveIndex({
            ...activeIndex,
            // @ts-ignore
            first: e.index,
          })
        }
      >
        <AccordionTab header="General">
          <div>
            <h6>Backup policy</h6>
            <Dropdown
              value={model.vmBackupPolicy}
              optionLabel="name"
              dataKey="guid"
              options={policies}
              onChange={(e) => {
                setModel({
                  ...model,
                  vmBackupPolicy: e.value,
                });
              }}
            />
          </div>
          {policiesService.isSnapshotManagementAvailable(model) && (
            <div>
              <h3>Snapshot management policy</h3>
              <Dropdown
                value={model.snapshotMgmtPolicy}
                optionLabel="name"
                dataKey="guid"
                options={snapshotPolicies}
                onChange={(e) => {
                  setModel({
                    ...model,
                    snapshotMgmtPolicy: e.value,
                  });
                }}
              />
            </div>
          )}
          {virtualMachinesService.areSnapshotsFreezable(model) && (
            <div>
              <h3>Quiesce/freeze before snapshot</h3>
              <ToggleButton
                checked={model.quiesceBeforeSnapshot}
                onChange={(e) => {
                  setModel({
                    ...model,
                    quiesceBeforeSnapshot: e.value,
                  });
                }}
              />
            </div>
          )}
          {isBaseImageConfigAvailable(model) && (
            <div>
              <h3>Windows image required</h3>
              <Dropdown
                value={model.baseImageCreationConfig.windowsImageRequired}
                optionLabel="name"
                dataKey="name"
                options={inheritableBooleanValues}
                onChange={(e) => {
                  setModel({
                    ...model,
                    baseImageCreationConfig: {
                      ...model.baseImageCreationConfig,
                      windowsImageRequired: e.value,
                    },
                  });
                }}
              />
            </div>
          )}
          {isBaseImageConfigAvailable(model) && (
            <div>
              <h3>Linux image required</h3>
              <Dropdown
                value={model.baseImageCreationConfig.linuxImageRequired}
                optionLabel="name"
                dataKey="name"
                options={inheritableBooleanValues}
                onChange={(e) => {
                  setModel({
                    ...model,
                    baseImageCreationConfig: {
                      ...model.baseImageCreationConfig,
                      linuxImageRequired: e.value,
                    },
                  });
                }}
              />
            </div>
          )}
          {!!modes && model.length > 0 && (
            <div>
              <h3>Export/Import mode</h3>
              <Dropdown
                value={model.vmExportImportMode}
                optionLabel="name"
                dataKey="name"
                options={modes}
                onChange={(e) => {
                  setModel({
                    ...model,
                    vmExportImportMode: e.value,
                  });
                }}
              />
            </div>
          )}
        </AccordionTab>
        {virtualMachinesService.arePrePostSnapActionsAvailable(model) && (
          <AccordionTab header="Pre snapshot command execution">
            <div>
              <h3>Execute command before creating a VM snapshot</h3>
              <ToggleButton
                checked={model.preSnapCmdExecEnabled}
                onChange={(e) => {
                  setModel({
                    ...model,
                    preSnapCmdExecEnabled: e.value,
                    preSnapCmdArgs: [],
                  });
                }}
              />
            </div>
            {model.preSnapCmdExecEnabled && (
              <div>
                <div>
                  <h3>Pre snapshot standard error output stream handling</h3>
                  <Dropdown
                    value={model.preSnapStdErrorHandling}
                    optionLabel="name"
                    dataKey="name"
                    options={preAndPostSnapStdErrorHandlingOptions}
                    onChange={(e) => {
                      setModel({
                        ...model,
                        preSnapStdErrorHandling: e.value,
                      });
                    }}
                  />
                </div>
                <div>
                  <h3>Pre snapshot ignored exit codes</h3>
                  <InputText
                    value={model.preSnapIgnoredExitCodes}
                    type="number"
                    onChange={(e: any) => {
                      setModel({
                        ...model,
                        preSnapIgnoredExitCodes: e.target.value,
                      });
                    }}
                  />
                </div>
                <div>
                  <h4>
                    Pre-snapshot command arguments (all space-separated
                    arguments should be provided as separate arguments, first
                    argument is the executable)
                  </h4>
                  <Chips
                    value={model.preSnapCmdArgs}
                    separator=","
                    className="w-100"
                    onChange={(e) => {
                      setModel({
                        ...model,
                        preSnapCmdArgs: e.value,
                      });
                    }}
                  />
                  <div>
                    <small>Comma separated</small>
                  </div>
                </div>
              </div>
            )}
          </AccordionTab>
        )}
        {virtualMachinesService.arePrePostSnapActionsAvailable(model) && (
          <AccordionTab header="Post snapshot command execution">
            <div>
              <h3>Execute command after creating a VM snapshot</h3>
              <ToggleButton
                checked={model.postSnapCmdExecEnabled}
                onChange={(e) => {
                  setModel({
                    ...model,
                    postSnapCmdExecEnabled: e.value,
                    postSnapCmdArgs: [],
                  });
                }}
              />
            </div>
            {model.postSnapCmdExecEnabled && (
              <div>
                <div>
                  <h3>Post snapshot standard error output stream handling</h3>
                  <Dropdown
                    value={model.postSnapStdErrorHandling}
                    optionLabel="name"
                    dataKey="name"
                    options={preAndPostSnapStdErrorHandlingOptions}
                    onChange={(e) => {
                      setModel({
                        ...model,
                        postSnapStdErrorHandling: e.value,
                      });
                    }}
                  />
                </div>
                <div>
                  <h3>Post snapshot ignored exit codes</h3>
                  <InputText
                    value={model.postSnapIgnoredExitCodes}
                    type="number"
                    onChange={(e: any) => {
                      setModel({
                        ...model,
                        postSnapIgnoredExitCodes: e.target.value,
                      });
                    }}
                  />
                </div>
                <div>
                  <h4>
                    Post-snapshot command arguments (all space-separated
                    arguments should be provided as separate arguments, first
                    argument is the executable)
                  </h4>
                  <Chips
                    value={model.postSnapCmdArgs}
                    separator=","
                    className="w-100"
                    onChange={(e) => {
                      setModel({
                        ...model,
                        postSnapCmdArgs: e.value,
                      });
                    }}
                  />
                  <div>
                    <small>Comma separated</small>
                  </div>
                </div>
              </div>
            )}
          </AccordionTab>
        )}
        <AccordionTab header="SSH access (for pre/post snapshot command execution)">
          <div>
            <h3>SSH host</h3>
            <InputText
              value={model.sshHost}
              type="text"
              onChange={(e: any) => {
                setModel({
                  ...model,
                  sshHost: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <h3>SSH port</h3>
            <InputText
              value={model.sshPort}
              type="text"
              onChange={(e: any) => {
                setModel({
                  ...model,
                  sshPort: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <h3>SSH user</h3>
            <InputText
              value={model.sshUser}
              type="text"
              onChange={(e: any) => {
                setModel({
                  ...model,
                  sshUser: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <h3>SSH key path</h3>
            <InputText
              value={model.sshKeyPath}
              type="text"
              onChange={(e: any) => {
                setModel({
                  ...model,
                  sshKeyPath: e.target.value,
                });
              }}
            />
          </div>
        </AccordionTab>
      </Accordion>
      <div className="d-flex justify-content-between mt-3">
        <div>
          <Button label="Back" onClick={history.back} />
        </div>
        <div>
          <Button label="Save" className="p-button-success" onClick={save} />
        </div>
      </div>
      <Accordion
        className="mt-3"
        multiple
        activeIndex={activeIndex.second}
        onTabChange={(e) =>
          setActiveIndex({
            ...activeIndex,
            // @ts-ignore
            second: e.index,
          })
        }
      >
        <AccordionTab header="Configure SSH password (for pre/post snapshot command execution)">
          <div>
            <h3>SSH password</h3>
            <InputText
              value={sshPassword.first}
              type="password"
              onChange={(e: any) => {
                setSshPassword({
                  ...sshPassword,
                  first: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <h3>Retype SSH password</h3>
            <InputText
              value={sshPassword.second}
              type="password"
              onChange={(e: any) => {
                setSshPassword({
                  ...sshPassword,
                  second: e.target.value,
                });
              }}
            />
          </div>
          <div className="d-flex justify-content-end mt-3">
            <div>
              <Button
                label="Save"
                className="p-button-success"
                disabled={
                  !sshPassword.first || sshPassword.first !== sshPassword.second
                }
                onClick={savePassword}
              />
            </div>
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default Settings;
