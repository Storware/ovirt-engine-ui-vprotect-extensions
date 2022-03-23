import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TabList } from 'components/tabs/Tab';
import getLastElementOfPath from 'components/tabs/getLastElementOfPath';

export default ({ items }: { items: TabList }) => {
  const location = useLocation();
  const path = getLastElementOfPath();
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');

  return (
    <div className="p-tabmenu p-component">
      <ul className="p-tabmenu-nav p-reset">
        {items.tabs.map((el) => {
          return (
            <Link to={`${pathWithoutTab}/${el.path}`} key={el.path}>
              <li
                className={`p-tabmenuitem ${
                  (path === el.path && 'p-highlight') || ''
                } `}
                key={el.path}
              >
                <div className="p-menuitem-link">
                  <span className="p-menuitem-text">{el.label}</span>
                </div>
              </li>
            </Link>
          );
        })}
        <li className="p-tabmenu-ink-bar" style={items.inkStyle[path]} />
      </ul>
    </div>
  );
};
