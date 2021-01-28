import React from 'react';
import Schedules from 'pages/schedules/Schedules';
import Policies from 'pages/policies/Policies';
import { Dashboard } from 'pages/dashboard/Dashboard';
import { TaskConsole } from 'pages/task-console/TaskConsole';
import { useSelector } from 'react-redux';
import MountedBackups from 'pages/mounted-backups/MountedBackups';
import { selectLoading } from 'store/loading/selectors';
import { selectShow } from 'store/modal/selectors';
import ModalContainer from 'components/modal/ModalContainer';
import VirtualMachines from 'pages/virtual-machines/VirtualMachines';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

const App = () => {
  const modalShow = useSelector(selectShow);
  const loading = useSelector(selectLoading);
  const href = window.parent.location.href;
  const start = href.indexOf('/dashboard/vprotect');
  const startOfPath = href.substring(start + 20);
  const path = startOfPath.length ? startOfPath.slice(0, -1) : 'dashboard';
  return (
    <Router>
      <div className={'py-4 container-fluid'}>
        <Redirect
          to={{
            pathname: '/' + path,
          }}
        />
        <Switch>
          <Route path="/dashboard">
            <div>Dashboard</div>
            <Dashboard />
          </Route>
          <Route path="/virtualEnvironments">
            <VirtualMachines />
          </Route>
          <Route path="/taskConsole">
            <TaskConsole />
          </Route>
          <Route path="/policies">
            <Policies />
          </Route>
          <Route path="/schedules">
            <Schedules />
          </Route>
          <Route path="/mountedBackups">
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
