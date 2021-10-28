import React, { useEffect, useState } from 'react';
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
import { InputText } from 'primereact/inputtext';

export const BackupModal = ({ virtualEnvironments, ...props }) => {
  const dispatch = useDispatch();

  let task;
  let setTask;
  [task, setTask] = useState(new BackupTask());

  useEffect(() => {
    setTask({
      ...task,
      protectedEntities: virtualEnvironments,
    });
    dispatch(
      getBackupDestinationsAndBackupTypes(
        virtualEnvironments,
        props.showIncremental,
      ),
    );
  }, []);

  const backupDestinations = useSelector(selectBackupDestinations);
  const backupTypes = useSelector(selectBackupTypes);

  const setPriority = (value) => {
    setTask({
      ...task,
      priority: value.target.value,
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
          className="mb-3"
        />

        <Select
          label="Backup destination"
          required
          optionLabel="name"
          dataKey="guid"
          value={task.backupDestination}
          options={backupDestinations}
          onChange={(event) =>
            setTask({
              ...task,
              backupDestination: event.value,
            })
          }
        />

        <div className="mt-3">
          <label>Priority</label>
          <InputText value={task.priority} onChange={setPriority} />
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
      </div>
    </div>
  );
};

BackupModal.propTypes = {
  virtualEnvironments: PropTypes.any.isRequired,
};
