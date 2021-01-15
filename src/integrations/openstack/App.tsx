import Schedules from 'pages/schedules/Schedules';
import Policies from 'pages/policies/Policies';
import Dashboard from 'pages/dashboard/Dashboard';
import TaskConsole from 'pages/task-console/TaskConsole';
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
  Redirect,
} from 'react-router-dom';

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
          <Route path='/dashboard'>
            <Dashboard />
          </Route>
          <Route path='/virtual-machines'>
            <VirtualMachines />
          </Route>
          <Route path='/task-console'>
            <TaskConsole />
          </Route>
          <Route path='/policies'>
            <Policies />
          </Route>
          <Route path='/schedules'>
            <Schedules />
          </Route>
          <Route path='/mounted-backups'>
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
