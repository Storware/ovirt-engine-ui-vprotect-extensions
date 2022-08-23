import Select from '../../input/Select';
import { InputText } from 'primereact/inputtext';
import { Button } from 'components/button';
import React from 'react';
import { InputDate } from '../../input/InputDate';
import VmsNotReadyForIncTable from './VmsNotReadyForIncTable/VmsNotReadyForIncTable';

export const Backup = ({
  task,
  setTask,
  backupTypes,
  setPriority,
  selectView,
}) => (
  <div className="form">
    <Select
      label="Backup type"
      required
      dataKey="name"
      optionLabel="name"
      value={task.backupType}
      options={backupTypes}
      onChange={(event) =>
        setTask({
          ...task,
          backupType: event.value,
        })
      }
    />

    {task.backupType?.name === 'INCREMENTAL' && (
      <VmsNotReadyForIncTable vms={task?.protectedEntities} />
    )}

    <div className="mt-3">
      <label>Priority</label>
      <InputText value={task.priority} onChange={setPriority} />
    </div>

    <div className="mt-3">
      <label>Retry Count</label>
      <InputText
        type="number"
        value={task.retryCount}
        onChange={({ target: { value } }) =>
          setTask({
            ...task,
            retryCount: value,
          })
        }
      />
    </div>

    <div className="mt-3">
      <label className={'mr-2'}>Window start</label>
      <InputDate
        value={task.windowStart}
        onChange={(e) =>
          setTask({
            ...task,
            windowStart: e,
          })
        }
      />
    </div>
    {task?.protectedEntities?.some((entity) => !!entity?.vmBackupPolicy) && (
      <div className="mt-3">
        <Button
          label={`Select rules (${task.rules.length || 0})`}
          onClick={selectView}
        />
      </div>
    )}
  </div>
);
