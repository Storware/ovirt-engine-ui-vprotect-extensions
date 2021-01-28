import React from 'react';
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
  Redirect,
} from 'react-router-dom';
import SchedulesList from './SchedulesList';

const items = [
  { label: 'Virtual Environment Backup', type: 'VM_BACKUP' },
  { label: 'Snapshot Management', type: 'SNAPSHOT' },
];

export const SchedulesListContainer = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const type = location.pathname.split('/').pop();

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
        <Route path={`${match.path}/:type`}>
          <SchedulesList />
        </Route>
        <Route>
          <Redirect
            to={{
              pathname: `${match.path}/VM_BACKUP`,
            }}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default SchedulesListContainer;
