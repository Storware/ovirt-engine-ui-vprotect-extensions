import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoading } from 'store/loading/selectors';
import { selectShow } from 'store/modal/selectors';
import ModalContainer from 'components/modal/ModalContainer';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import routes from 'utils/routes';
import Routes from 'components/routes/Routes';

const App = () => {
  const modalShow = useSelector(selectShow);
  const loading = useSelector(selectLoading);
  const href = window.parent.location.href;
  const start = href.indexOf('/vprotect');
  const startOfPath = href.substring(start + 10);
  const path = startOfPath.length ? startOfPath.slice(0, -1) : 'dashboard';
  return (
    <div>
      <ReactNotifications />
      <Router>
        <div className={'py-4 container-fluid'}>
          <Redirect
            to={{
              pathname: '/' + path,
            }}
          />
          <Switch>
            <Routes items={routes} />
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
