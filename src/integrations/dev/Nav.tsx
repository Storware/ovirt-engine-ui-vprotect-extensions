import React from 'react';
import routes from 'utils/routes';
import './Nav.scss';

export const Nav = () => {
  const getPageName = (path: string) =>
    path.replace('/', '').replace(/_/g, ' ');

  return (
    <nav className="nav-dev">
      {routes.map(({ path }, key) => (
        <a href={path} key={key}>
          {getPageName(path)}
        </a>
      ))}
    </nav>
  );
};
