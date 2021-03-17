import React from 'react';
import { RouteList } from 'components/routes/Route';
import { Route } from 'react-router-dom';

export default ({
  items,
  absolutePathPart,
}: {
  items: RouteList;
  absolutePathPart?: string;
}) => {
  return (
    <div>
      {items.map((route) => {
        const Component = route.component;
        return (
          <Route
            path={`${absolutePathPart ? absolutePathPart + '/' : ''}${
              route.path
            }`}
          >
            <Component />
          </Route>
        );
      })}
    </div>
  );
};
