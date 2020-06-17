import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import MountedBackupsList from './mounted-backups-list/MountedBackupsList';
import MountedBackup from './mounted-backup/MountedBackup';

const MountedBackups = () => {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.path}>
        <MountedBackupsList />
      </Route>
      <Route path={`${match.path}/:guid`}>
        <MountedBackup />
      </Route>
    </Switch>
  );
};

export default MountedBackups;
