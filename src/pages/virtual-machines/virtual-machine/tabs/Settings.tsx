import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectPolicies,
  selectSnapshotPolicies,
  selectVirtualMachine,
} from 'store/virtual-machine/selectors';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { policiesService } from 'services/policies-service';
import { alertService } from 'services/alert-service';
import { virtualMachinesService } from 'services/virtual-machines-service';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { createBrowserHistory } from 'history';
import {
  OsCredentials,
  PostSnapCommandExecution,
  PreSnapCommandExecution,
  SshAccess,
} from 'pages/virtual-machines/virtual-machine/components/settings';

const isBaseImageConfigAvailable = (model) =>
  model.hvmType != null && model.hvmType.name === 'AWS';

const inheritableBooleanValues = [
  { name: 'TRUE', description: 'True' },
  { name: 'FALSE', description: 'False' },
  { name: 'INHERIT', description: 'Inherit' },
];

export default () => {
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
  const modes =
    virtualMachinesService.getVirtualMachineExportImportModes(model);
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
            <div className={'mt-2'}>
              <h6>Snapshot management policy</h6>
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
            <div className={'mt-2'}>
              <h6>Quiesce/freeze before snapshot</h6>
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
          {modes?.length > 0 && (
            <div className={'mt-2'}>
              <h6>Export/Import mode</h6>
              <Dropdown
                disabled
                value={model.vmExportImportMode}
                optionLabel="description"
                dataKey="description"
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
        <AccordionTab header="Os Credentials">
          <OsCredentials model={model} setModel={setModel} />
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
      ></Accordion>
    </div>
  );
};
