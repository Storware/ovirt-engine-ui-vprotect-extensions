import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoading } from 'store/loading/selectors';
import { selectShow } from 'store/modal/selectors';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import ModalContainer from 'components/modal/ModalContainer';
import routes from 'utils/routes';
import Routes from 'components/routes/Routes';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

const App = () => {
  const modalShow = useSelector(selectShow);
  const loading = useSelector(selectLoading);
  const href = window.location.href;
  const start = href.indexOf(';');
  const path = href.substring(start + 1).replace(/;/g, '/');

  return (
    <div>
      <ReactNotification />
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
