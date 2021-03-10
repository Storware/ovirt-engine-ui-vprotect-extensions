import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoading } from 'store/loading/selectors';
import { selectShow } from 'store/modal/selectors';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import ModalContainer from 'components/modal/ModalContainer';
import routes from 'utils/routes';

const App = () => {
  const modalShow = useSelector(selectShow);
  const loading = useSelector(selectLoading);
  const href = window.location.href;
  const start = href.indexOf(';');
  const path = href.substring(start + 1).replace(/;/g, '/');

  return (
    <Router>
      {start > 0 && (
        <Redirect
          to={{
            pathname: '/' + path,
          }}
        />
      )}
      <div className={'py-4 container-fluid'}>
        <Switch>
          {routes.map((route) => {
            const Component = route.component;
            return (
              <Route path={route.path}>
                <Component />
              </Route>
            );
          })}
        </Switch>
        {modalShow && <ModalContainer />}
        <div className={'loading ' + (loading && 'active')}>
          <div className={'spinner'} />
        </div>
      </div>
    </Router>
  );
};

export default App;
