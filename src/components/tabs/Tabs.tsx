import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Tab } from 'components/tabs/Tab';
import getLastElementOfPath from 'components/tabs/getLastElementOfPath';

export default ({ items }: { items: Tab[] }) => {
  const location = useLocation();
  const path = getLastElementOfPath();
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');

  return (
    <div className="p-tabmenu p-component">
      <ul className="p-tabmenu-nav p-reset">
        {items.map(({ path: elPath, label }) => (
          <Link to={`${pathWithoutTab}/${elPath}`} key={elPath}>
            <li
              className={`p-tabmenuitem ${
                (path === elPath && 'p-highlight tab-active-ink') || ''
              } `}
              key={elPath}
            >
              <a className="p-menuitem-link">
                <span className="p-menuitem-text">{label}</span>
              </a>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};
