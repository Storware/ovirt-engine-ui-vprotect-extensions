import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PoliciesListContainer from './policies-list/PoliciesListContainer';
import Policy from './policy/Policy';

export const Policies = () => {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/list`}>
        <PoliciesListContainer />
      </Route>
      <Route path={`${match.path}/edit`}>
        <Policy />
      </Route>
    </Switch>
  );
};

export default Policies;
