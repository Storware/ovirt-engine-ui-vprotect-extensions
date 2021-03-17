import React from 'react';
import { Switch, useRouteMatch, Redirect } from 'react-router-dom';
import Summary from 'pages/reporting/Summary';
import Tabs from 'components/tabs/Tabs';
import { TabList } from 'components/tabs/Tab';
import { RouteList } from 'components/routes/Route';
import Routes from 'components/routes/Routes';
import DateRange from 'pages/reporting/DateRange';

const tabs: TabList = [
  { label: 'Summary', path: 'summary' },
  { label: 'Virtual Environment Backup', path: 'backups' },
  { label: 'Virtual Environment Restore', path: 'restores' },
  { label: 'Backup Size', path: 'backup-size' },
];

const routes: RouteList = [{ path: 'summary', component: Summary }];

export default () => {
  const match = useRouteMatch();

  return (
    <div>
      <DateRange />
      <Tabs items={tabs} />
      <Switch>
        <Routes items={routes} absolutePathPart={match.path} />
        <Redirect
          to={{
            pathname: `${match.path}/summary`,
          }}
        />
      </Switch>
    </div>
  );
};
