import React from 'react';
import routes from 'utils/routes';
import './Nav.scss';

export const Nav = () => {
  const getPageName = (path: string) =>
    path.replace('/', '').replace(/_/g, ' ');

  return (
    <nav className="nav-dev">
      {routes.map(({ path }) => (
        <a href={path}>{getPageName(path)}</a>
      ))}
    </nav>
  );
};
