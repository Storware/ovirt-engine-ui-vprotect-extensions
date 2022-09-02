import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBackupDestinationsAndBackupTypes,
  setIsSelectedRulesZero,
  submitTask,
} from 'store/backup-modal/actions';
import { selectBackupTypes } from 'store/backup-modal/selectors';
import { selectSaved } from 'store/modal/selectors';
import { BackupTask } from 'model/tasks/backup-task';
import { SelectRules } from './SelectRules';
import { Backup } from './Backup';
import { hideFooterAction, showFooterAction } from 'store/modal/actions';

const enum View {
  'Backup',
  'Rules',
}

export const BackupModal = ({ virtualEnvironments, rules = [], ...props }) => {
  const dispatch = useDispatch();

  const [task, setTask] = useState(new BackupTask());
  const [view, setView] = useState<View>(View.Backup);

  useEffect(() => {
    setTask({
      ...task,
      protectedEntities: virtualEnvironments,
      // always check first rules
      rules: virtualEnvironments
        .flatMap(
          ({ vmBackupPolicy = null }) => vmBackupPolicy?.rules?.[0] || rules,
        )
        .filter((e) => !!e),
    });
    dispatch(
      getBackupDestinationsAndBackupTypes(
        virtualEnvironments,
        props.showIncremental,
      ),
    );
  }, []);

  useEffect(() => {
    dispatch(setIsSelectedRulesZero(!(task.rules.length > 0)));
  }, [task]);

  const backupTypes = useSelector(selectBackupTypes);

  const setPriority = (value) => {
    setTask({
      ...task,
      priority: value.target.value,
    });
  };

  const updateSelectedRule = (checked: boolean, rule) => {
    setTask({
      ...task,
      rules: checked
        ? [...task.rules, rule]
        : task.rules.filter(({ guid }) => guid !== rule.guid),
    });
  };

  const toggleAllRules = (checked: boolean, rules: []) => {
    setTask({
      ...task,
      rules: checked
        ? [...task.rules, ...rules].reduce(
            (prev, acc) => (prev.indexOf(acc) === -1 ? [...prev, acc] : prev),
            [],
          )
        : task.rules.filter((el) => !rules.includes(el as never)),
    });
  };

  if (useSelector(selectSaved)) {
    dispatch(submitTask(task));
  }

  const displayView = () => {
    switch (view) {
      case View.Rules:
        dispatch(hideFooterAction());
        return (
          <SelectRules
            task={task}
            updateSelectedRule={updateSelectedRule}
            toggleAllRules={toggleAllRules}
            onBack={() => setView(View.Backup)}
          />
        );
      case View.Backup:
        dispatch(showFooterAction());
        return (
          <Backup
            backupTypes={backupTypes}
            setPriority={setPriority}
            setTask={setTask}
            selectView={() => setView(View.Rules)}
            task={task}
          />
        );
    }
  };

  return <div>{displayView()}</div>;
};

BackupModal.propTypes = {
  virtualEnvironments: PropTypes.any.isRequired,
};
