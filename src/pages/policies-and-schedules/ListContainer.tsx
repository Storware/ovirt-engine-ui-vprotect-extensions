import React, { useEffect, useState } from 'react';
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
import { TabInk } from '../../model';

const items = [
  { label: 'Policies', path: 'policies' },
  { label: 'Schedules', path: 'schedules' },
];

export const ListContainer = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const pathEl = pathParts[pathParts.length - 1];
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');
  const [inkStyle, setInkStyle] = useState<TabInk[]>([]);

  useEffect(() => {
    const list = document.querySelectorAll('.tabmenuitem-getwidth');
    list.forEach(({ id, clientWidth }) =>
      setInkStyle((prevState) => [
        ...prevState,
        {
          path: id,
          width: clientWidth.toString() + 'px',
          left:
            prevState.length > 0
              ? prevState
                  .reduce(
                    (prev, curr) => prev + +curr.width.replace('px', ''),
                    0,
                  )
                  .toString() + 'px'
              : '0px',
        },
      ]),
    );
  }, []);

  useEffect(() => {
    console.log(inkStyle);
  }, [inkStyle]);

  return (
    <div>
      <div className="p-tabmenu p-component">
        <ul className="p-tabmenu-nav p-reset">
          {items.map(({ path, label }) => (
            <Link to={`${pathWithoutTab}/${path}`} key={path}>
              <li
                className={`p-tabmenuitem tabmenuitem-getwidth ${
                  (pathEl === path && 'p-highlight') || ''
                } `}
                id={path}
                key={path}
              >
                <a className="p-menuitem-link">
                  <span className="p-menuitem-text">{label}</span>
                </a>
              </li>
            </Link>
          ))}
          <li
            className="p-tabmenu-ink-bar"
            style={inkStyle.find((item) => item.path === pathEl)}
          />
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
