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

const items = [
  { label: 'Policies', path: 'policies' },
  { label: 'Schedules', path: 'schedules' },
];

const inkStyle = {
  policies: { width: '105px', left: '0px' },
  schedules: { width: '122px', left: '105px' },
};

export const ListContainer = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const path = pathParts[pathParts.length - 1];
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');

  return (
    <div>
      <div className="p-tabmenu p-component">
        <ul className="p-tabmenu-nav p-reset">
          {items.map((el) => (
            <Link to={`${pathWithoutTab}/${el.path}`} key={el.path}>
              <li
                className={`p-tabmenuitem ${
                  (path === el.path && 'p-highlight') || ''
                } `}
                key={el.path}
              >
                <a className="p-menuitem-link">
                  <span className="p-menuitem-text">{el.label}</span>
                </a>
              </li>
            </Link>
          ))}
          <li className="p-tabmenu-ink-bar" style={inkStyle[path]} />
        </ul>
      </div>

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
