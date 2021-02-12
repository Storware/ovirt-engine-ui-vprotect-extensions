import React from 'react';
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
import PoliciesAndSchedules from 'pages/policies-and-schedules/PoliciesAndSchedules';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

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
            <Route path="/policiesAndSchedules">
              <PoliciesAndSchedules />
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
    </div>
  );
};

export default App;
