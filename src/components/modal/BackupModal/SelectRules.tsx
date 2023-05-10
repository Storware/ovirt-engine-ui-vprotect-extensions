import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { BackupTask } from '../../../model/tasks/backup-task';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';

interface Props {
  task: BackupTask;
  updateSelectedRule?;
  toggleAllRules?;
  onBack?: () => void;
  fromPolicy: boolean;
}
export const SelectRules = ({
  task,
  updateSelectedRule,
  onBack,
  toggleAllRules,
  fromPolicy,
}: Props) => {
  const [vmBackupPolicyArr] = useState(
    fromPolicy
      ? [task?.protectedEntities[0].vmBackupPolicy]
      : task?.protectedEntities?.map(({ vmBackupPolicy }) => vmBackupPolicy) ||
          [],
  );
  const [activeTabGuid, setActiveTabGuid] = useState(
    vmBackupPolicyArr?.[0]?.guid,
  );

  const CheckboxLabel = ({ name, checked, onChange, ...props }) => (
    <label {...props}>
      <Checkbox
        checked={checked}
        onChange={(value) => onChange(value.checked)}
        className="mr-2"
      />
      {name}
    </label>
  );

  return (
    <div>
      <Splitter style={{ height: '300px' }} className="disabled">
        <SplitterPanel className="p-3">
          {vmBackupPolicyArr.map(({ guid, name }) => (
            <label key={guid} className="w-100">
              <RadioButton
                style={{ display: 'none' }}
                value={guid}
                name="vmBackupPolicy"
                onChange={({ value }) => setActiveTabGuid(value)}
                checked={activeTabGuid === guid}
              />
              <h5
                style={{
                  borderBottom: activeTabGuid === guid ? '2px solid' : 'none',
                }}
              >
                {name}
              </h5>
            </label>
          ))}
        </SplitterPanel>
        <SplitterPanel className="p-3">
          {vmBackupPolicyArr.map(({ guid, rules }) => (
            <div
              key={guid}
              id={guid}
              hidden={guid !== activeTabGuid}
              className="d-flex flex-column"
            >
              <CheckboxLabel
                checked={rules?.every((e) => task.rules.includes(e))}
                onChange={(checked) => toggleAllRules(checked, rules)}
                name="Toggle all"
              />
              {rules?.map((rule) => (
                <CheckboxLabel
                  key={rule.guid}
                  name={rule.name}
                  checked={task.rules.some(({ guid: id }) => rule.guid === id)}
                  onChange={(checked) => updateSelectedRule(checked, rule)}
                />
              ))}
            </div>
          ))}
        </SplitterPanel>
      </Splitter>
      <div className="mt-3">
        <Button label="Back" onClick={onBack} />
      </div>
    </div>
  );
};
