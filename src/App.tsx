import React from 'react';
import VirtualMachines from './pages/virtual-machines/VirtualMachines';
import { Dashboard } from './pages/dashboard/Dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { TaskConsole } from './pages/task-console/TaskConsole';
import Policies from './pages/policies/Policies';
import Schedules from './pages/schedules/Schedules';
import MountedBackups from './pages/mounted-backups/MountedBackups';
import ModalContainer from './components/modal/ModalContainer';
import { useSelector } from 'react-redux';
import { selectShow } from './store/modal/selectors';
import { selectLoading } from './store/loading/selectors';

const App = () => {
  let modalShow = useSelector(selectShow);
  let loading = useSelector(selectLoading);
  const href = window.location.href;
  const start = href.indexOf(';');
  const path = href.substring(start + 1);

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
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/virtual-machines">
            <VirtualMachines />
          </Route>
          <Route path="/task-console">
            <TaskConsole />
          </Route>
          <Route path="/policies">
            <Policies />
          </Route>
          <Route path="/schedules">
            <Schedules />
          </Route>
          <Route path="/mounted-backups">
            <MountedBackups />
          </Route>
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
