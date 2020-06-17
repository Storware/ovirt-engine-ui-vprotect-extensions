import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import BackupPolicy from './BackupPolicy';
import SnapshotPolicy from './SnapshotPolicy';

export const Policy = () => {
  let match = useRouteMatch();

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

export default Policy;
