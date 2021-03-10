import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoading } from 'store/loading/selectors';
import { selectShow } from 'store/modal/selectors';
import ModalContainer from 'components/modal/ModalContainer';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import routes from 'utils/routes';

const App = () => {
  const modalShow = useSelector(selectShow);
  const loading = useSelector(selectLoading);
  const href = window.parent.location.href;
  const start = href.indexOf('/dashboard/vprotect');
  const startOfPath = href.substring(start + 20);
  const path = startOfPath.length ? startOfPath.slice(0, -1) : 'dashboard';
  return (
    <div>
      <ReactNotification />
      <Router>
        <div className={'py-4 container-fluid'}>
          <Redirect
            to={{
              pathname: '/' + path,
            }}
          />
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
    </div>
  );
};

export default App;
