import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import CredentialsList from './components/CredentialsList';
import CredentialForm from './components/CredentialForm';

export default () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/create`}>
        <CredentialForm header="Create Credential" />
      </Route>
      <Route path={`${match.path}/:guid`}>
        <CredentialForm header="Edit Credential" />
      </Route>
      <Route path={`${match.path}`}>
        <CredentialsList />
      </Route>
    </Switch>
  );
};
