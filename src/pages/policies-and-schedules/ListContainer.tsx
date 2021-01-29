import React from 'react';
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
  useParams,
} from 'react-router-dom';
import SchedulesList from 'pages/schedules/schedules-list/SchedulesList';
import PoliciesList from 'pages/policies/policies-list/PoliciesList';

const items = [
  { label: 'Policies', type: 'policies' },
  { label: 'Schedules', type: 'schedules' },
];

export const ListContainer = () => {
  const match = useRouteMatch();
  const { type } = useParams();

  return (
    <div>
      <ul className="nav nav-tabs">
        {items.map((el) => {
          return (
            <li className={type === el.type && 'active'}>
              <Link to={`${match.path}/${el.type}`}>
                <a>{el.label}</a>
              </Link>
            </li>
          );
        })}
      </ul>

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
