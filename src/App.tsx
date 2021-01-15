import React from 'react';
import Schedules from 'pages/schedules/Schedules';
import Policies from 'pages/policies/Policies';
import {Dashboard} from 'pages/dashboard/Dashboard';
import {TaskConsole} from 'pages/task-console/TaskConsole';
import {useSelector} from 'react-redux';
import MountedBackups from 'pages/mounted-backups/MountedBackups';
import {selectLoading} from 'store/loading/selectors';
import {selectShow} from 'store/modal/selectors';
import ModalContainer from 'components/modal/ModalContainer';
import VirtualMachines from 'pages/virtual-machines/VirtualMachines';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

const App = () => {
  const modalShow = useSelector(selectShow);
  const loading = useSelector(selectLoading);

  return (
    <Router>
      <div className={'py-4 container-fluid'}>
        <Switch>
          <Route exact path='/dashboard/vprotect/'>
            <Dashboard />
          </Route>
          <Route path='/dashboard/vprotect/virtualEnvironments/'>
            <VirtualMachines />
          </Route>
          <Route path='/dashboard/vprotect/taskConsole/'>
            <TaskConsole />
          </Route>
          <Route path='/dashboard/vprotect/policies/'>
            <Policies />
          </Route>
          <Route path='/dashboard/vprotect/schedules/'>
            <Schedules />
          </Route>
          <Route path='/dashboard/vprotect/mounted-backups/'>
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
