import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TabList } from 'components/tabs/Tab';

export default ({ items }: { items: TabList }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const path = pathParts[pathParts.length - 1];
  const pathWithoutTab = location.pathname.split('/').slice(0, -1).join('/');

  return (
    <ul className="nav nav-tabs">
      {items.map((el) => {
        return (
          <li className={path === el.path && 'active'}>
            <Link to={`${pathWithoutTab}/${el.path}`}>
              <a>{el.label}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
