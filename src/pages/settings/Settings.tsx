import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import MailingTable from 'pages/settings/mailing/mailing-table/MailingTable';
import MailingList from 'pages/settings/mailing/mailing-list/MailingList';

export default () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/mailing-list/:guid`}>
        <MailingList />
      </Route>
      <Route path={`${match.path}/mailing-list`}>
        <MailingTable />
      </Route>
      <Redirect
        to={{
          pathname: `${match.path}/mailing-list`,
        }}
      />
    </Switch>
  );
};
