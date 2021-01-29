import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import SnapshotPolicy from 'pages/policies/SnapshotPolicy';
import BackupPolicy from './BackupPolicy';

export const Policies = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/vm-backup/:guid`}>
        <BackupPolicy />
      </Route>
      <Route path={`${match.path}/snapshot/:guid`}>
        <SnapshotPolicy />
      </Route>
    </Switch>
  );
};

export default Policies;
