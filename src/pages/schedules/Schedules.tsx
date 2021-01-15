import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import SchedulesListContainer from './schedules-list/SchedulesListContainer';
import SnapshotSchedule from 'pages/schedules/SnapshotSchedule';
import VirtualEnvironmentBackupSchedule from './VirtualEnvironmentBackupSchedule';

const Schedules = () => {
  let match = useRouteMatch();

  return (
    <Switch>
        <Route  path={`${match.path}vm_backup/:guid`}>
            <VirtualEnvironmentBackupSchedule />
        </Route>
        <Route path={`${match.path}snapshot/:guid`}>
            <SnapshotSchedule />
        </Route>
      <Route path={`${match.path}`}>
        <SchedulesListContainer />
      </Route>
    </Switch>
  );
};

export default Schedules;
