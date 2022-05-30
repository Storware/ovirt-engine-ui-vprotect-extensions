import React from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';
import { preAndPostSnapStdErrorHandlingOptions } from '../../../../../services/virtual-machines-service';
import { commandTypes } from '../../../../../model/command/command-type';

export const PreSnapCommandExecution = ({ model, setModel }) => (
  <>
    <div>
      <h6>Execute command before creating a VM snapshot</h6>
      <ToggleButton
        checked={model.preSnapCmdExecEnabled}
        onChange={({ value }) => {
          setModel({
            ...model,
            preSnapCmdExecEnabled: value,
            preSnapCmdArgs: [],
          });
        }}
      />
    </div>
    {model.preSnapCmdExecEnabled && (
      <div>
        <div>
          <h6>Pre snapshot standard error output stream handling</h6>
          <Dropdown
            value={model.preSnapStdErrorHandling}
            optionLabel="name"
            dataKey="name"
            options={preAndPostSnapStdErrorHandlingOptions}
            onChange={({ value }) => {
              setModel({
                ...model,
                preSnapStdErrorHandling: value,
              });
            }}
          />
        </div>
        <div>
          <h6>Pre snapshot ignored exit codes</h6>
          <InputText
            value={model.preSnapIgnoredExitCodes}
            type="number"
            onChange={({ target: { value } }) => {
              setModel({
                ...model,
                preSnapIgnoredExitCodes: value,
              });
            }}
          />
        </div>
        <div>
          <h6>Command Type</h6>
          <Dropdown
            value={model.preCommand.commandType}
            optionLabel="description"
            options={[{}, ...commandTypes]}
            onChange={({ value }) => {
              const m = JSON.parse(JSON.stringify(model));
              m.preCommand.commandType = value;
              if (!value?.description) {
                delete m.preCommand.commandType;
              }
              setModel(m);
            }}
          />
        </div>
        <div>
          <h6>
            Pre-snapshot command arguments (all space-separated arguments should
            be provided as separate arguments, first argument is the executable)
          </h6>
          <Chips
            value={model.preSnapCmdArgs}
            separator=","
            className="w-100"
            onChange={({ value }) => {
              setModel({
                ...model,
                preSnapCmdArgs: value,
              });
            }}
          />
          <div>
            <small>Comma separated</small>
          </div>
        </div>
      </div>
    )}
  </>
);
