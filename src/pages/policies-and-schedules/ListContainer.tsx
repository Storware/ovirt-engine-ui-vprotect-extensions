import React from 'react';
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import SchedulesList from 'pages/schedules/SchedulesList';
import PoliciesList from 'pages/policies/PoliciesList';
import { Tab } from 'components/tabs/Tab';
import Tabs from '../../components/tabs/Tabs';

const tabs: Tab[] = [
  { label: 'Policies', path: 'policies' },
  { label: 'Schedules', path: 'schedules' },
];

export const ListContainer = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const path = pathParts[pathParts.length - 1];
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');

  return (
    <div>
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
