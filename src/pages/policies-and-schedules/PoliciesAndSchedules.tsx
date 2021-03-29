import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import BackupPolicy from 'pages/policies/BackupPolicy';
import ListContainer from 'pages/policies-and-schedules/ListContainer';
import SnapshotPolicy from 'pages/policies/SnapshotPolicy';
import VirtualEnvironmentBackupSchedule from 'pages/schedules/VirtualEnvironmentBackupSchedule';
import SnapshotSchedule from 'pages/schedules/SnapshotSchedule';

export const PoliciesAndSchedules = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route path={`${match.path}/vm-backup/schedules/:guid`}>
          <VirtualEnvironmentBackupSchedule />
        </Route>
        <Route path={`${match.path}/vm-snapshot/schedules/:guid`}>
          <SnapshotSchedule />
        </Route>
        <Route path={`${match.path}/vm-backup/policies/:guid`}>
          <BackupPolicy />
        </Route>
        <Route path={`${match.path}/vm-snapshot/policies/:guid`}>
          <SnapshotPolicy />
        </Route>
        <Route path={`${match.path}/:type`}>
          <ListContainer />
        </Route>
        <Redirect
          to={{
            pathname: `${match.path}/vm-backup`,
          }}
        />
      </Switch>
    </div>
  );
};

export default PoliciesAndSchedules;
