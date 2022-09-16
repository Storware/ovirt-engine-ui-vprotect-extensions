import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import SchedulesList from 'pages/schedules/SchedulesList';
import PoliciesList from 'pages/policies/PoliciesList';
import { Tab } from 'components/tabs/Tab';
import Tabs from 'components/tabs/Tabs';

const tabs: Tab[] = [
  { label: 'Policies', path: 'policies' },
  { label: 'Schedules', path: 'schedules' },
];

export const ListContainer = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Tabs items={items} />
      <Tabs items={tabs} />

      <Switch>
        <Route path={`${match.path}/policies`}>
          <PoliciesList />
        </Route>
        <Route path={`${match.path}/schedules`}>
          <SchedulesList />
        </Route>
        <Redirect
          to={{
            pathname: `${match.path}/policies`,
          }}
        />
      </Switch>
    </div>
  );
};

export default ListContainer;
