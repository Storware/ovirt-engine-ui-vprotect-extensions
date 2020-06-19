import React, { useEffect, useState } from 'react';
import { Slider } from 'patternfly-react';
import PropTypes from 'prop-types';
import { InputDate } from '../input/InputDate';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBackupDestinationsAndBackupTypes,
  submitTask,
} from 'store/backup-modal/actions';
import {
  selectBackupDestinations,
  selectBackupTypes,
} from 'store/backup-modal/selectors';
import { selectSaved } from 'store/modal/selectors';
import { BackupTask } from 'model/tasks/backup-task';
import Select from '../input/Select';

export const BackupModal = ({ virtualEnvironments }) => {
  const dispatch = useDispatch();

  let task;
  let setTask;
  [task, setTask] = useState(new BackupTask());

  useEffect(() => {
    setTask({
      ...task,
      protectedEntities: virtualEnvironments,
    });
    dispatch(getBackupDestinationsAndBackupTypes(virtualEnvironments));
  }, []);

  const backupDestinations = useSelector(selectBackupDestinations);
  const backupTypes = useSelector(selectBackupTypes);

  const setPriority = (value) => {
    setTask({
      ...task,
      priority: JSON.parse(value),
    });
  };

  if (useSelector(selectSaved)) {
    dispatch(submitTask(task));
  }

  return (
    <div>
      <div className="form">
        <Select
          label="Backup type"
          required
          dataKey='name'
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

        <Select
          label="Backup destination"
          required
          optionLabel="name"
          dataKey='guid'
          value={task.backupDestination}
          options={backupDestinations}
          onChange={(event) =>
            setTask({
              ...task,
              backupDestination: event.value,
            })
          }
        />

        <div>
          <label>Priority</label>
          <Slider
            id="slider-one"
            showBoundaries
            value={task.priority}
            tooltip="show"
            input
            onSlide={setPriority}
          />
        </div>
        <div>
          <label>Window start</label>
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
      </div>
    </div>
  );
};

BackupModal.propTypes = {
  virtualEnvironments: PropTypes.any.isRequired,
};
