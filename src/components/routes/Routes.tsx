import React from 'react';
import { RouteList } from 'components/routes/Route';
import { Route, Redirect, useLocation } from 'react-router-dom';

export default ({
  items,
  absolutePathPart,
}: {
  items: RouteList;
  absolutePathPart?: string;
}) => {
  const location = useLocation();

  const isPathAbsolute = [absolutePathPart, `${absolutePathPart}/`].includes(
    location.pathname,
  );

  return (
    <div>
      {items.map((route) => {
        const Component = route.component;
        return (
          <Route
            key={route.path}
            path={`${absolutePathPart ? absolutePathPart + '/' : ''}${
              route.path
            }`}
          >
            <Component />
          </Route>
        );
      })}
      {isPathAbsolute && (
        <Redirect
          to={{
            pathname: `${absolutePathPart}/${items[0].path}`,
          }}
        />
      )}
    </div>
  );
};
