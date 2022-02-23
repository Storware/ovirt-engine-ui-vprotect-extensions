import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import CredentialsList from './CredentialsList';
import Credential from './Credential';

export default () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/create`}>
        <Credential type="Create" />
      </Route>
      <Route path={`${match.path}/:guid`}>
        <Credential type="Edit" />
      </Route>
      <Route path={`${match.path}`}>
        <CredentialsList />
      </Route>
    </Switch>
  );
};
