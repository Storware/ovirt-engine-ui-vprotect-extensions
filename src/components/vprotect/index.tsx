import React from 'react'
import VirtualMachines from './pages/virtual-machines/VirtualMachines'
import {Dashboard} from './pages/dashboard/Dashboard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import {TaskConsole} from './pages/task-console/TaskConsole'
import Policies from './pages/policies/Policies'
import Schedules from './pages/schedules/Schedules'
import MountedBackups from './pages/mounted-backups/MountedBackups';
import ModalContainer from './compoenents/modal/ModalContainer';
import {useSelector} from 'react-redux';
import {selectShow} from '../../store/modal/selectors';

const Index = () => {
  let modalShow = useSelector(selectShow);

  const href = window.location.href
  const start = href.indexOf(';')
  const path = href.substring(start + 1)

  return (
      //   <Router>
      //     <Redirect
      //       to={{
      //         pathname: '/' + this.path,
      //         state: {from: '/'}
      //       }}
      //     />
      //     <div className={'pt-4 container-fluid'}>
      //       <Switch>
      //         <Route path='/dashboard'>
      //           <Dashboard />
      //         </Route>
      //         <Route path='/virtual-machines'>
      //           <VirtualMachines />
      //         </Route>
      //         <Route path='/task-console'>
      //           <TaskConsole />
      //         </Route>
      //         <Route path='/policies'>
      //           <Policies />
      //         </Route>
      //         <Route path='/schedules'>
      //           <Schedules />
      //         </Route>
      //       </Switch>
      //     </div>
      //   </Router>
      <div>
        <Router>
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
          </div>
        </Router>
        {modalShow && <ModalContainer/>}
      </div>
  )
}

export default Index
