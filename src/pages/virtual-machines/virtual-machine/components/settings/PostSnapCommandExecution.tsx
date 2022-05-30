import React from 'react';
import { ToggleButton } from 'primereact/togglebutton';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';
import { preAndPostSnapStdErrorHandlingOptions } from '../../../../../services/virtual-machines-service';
import { commandTypes } from '../../../../../model/command/command-type';

export const PostSnapCommandExecution = ({ model, setModel }) => (
  <>
    <div>
      <h6>Execute command after creating a VM snapshot</h6>
      <ToggleButton
        checked={model.postSnapCmdExecEnabled}
        onChange={({ value }) => {
          setModel({
            ...model,
            postSnapCmdExecEnabled: value,
            postSnapCmdArgs: [],
          });
        }}
      />
    </div>
    {model.postSnapCmdExecEnabled && (
      <div>
        <div>
          <h6>Post snapshot standard error output stream handling</h6>
          <Dropdown
            value={model.postSnapStdErrorHandling}
            optionLabel="name"
            dataKey="name"
            options={preAndPostSnapStdErrorHandlingOptions}
            onChange={({ value }) => {
              setModel({
                ...model,
                postSnapStdErrorHandling: value,
              });
            }}
          />
        </div>
        <div>
          <h6>Post snapshot ignored exit codes</h6>
          <InputText
            value={model.postSnapIgnoredExitCodes}
            type="number"
            onChange={({ target: { value } }) => {
              setModel({
                ...model,
                postSnapIgnoredExitCodes: value,
              });
            }}
          />
        </div>
        <div>
          <h6>Command Type</h6>
          <Dropdown
            value={model.postCommand.commandType}
            optionLabel="description"
            options={[{}, ...commandTypes]}
            onChange={({ value }) => {
              const m = JSON.parse(JSON.stringify(model));
              m.postCommand.commandType = value;
              if (!value?.description) {
                delete m.postCommand.commandType;
              }
              setModel(m);
            }}
          />
        </div>
        <div>
          <h6>
            Post-snapshot command arguments (all space-separated arguments
            should be provided as separate arguments, first argument is the
            executable)
          </h6>
          <Chips
            value={model.postSnapCmdArgs}
            separator=","
            className="w-100"
            onChange={({ value }) => {
              setModel({
                ...model,
                postSnapCmdArgs: value,
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
