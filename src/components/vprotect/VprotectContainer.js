import React from 'react'
import {VirtualMachineList} from './virtual-machine-list/VirtualMachineList'
import {Dashboard} from './dashboard/Dashboard'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import {TaskConsole} from './task-console/TaskConsole'

export class VprotectContainer extends React.Component {
  constructor (props) {
    super(props)

    const href = window.location.href
    console.log(href)
    const start = href.indexOf('vprotect/')
    const end = href.indexOf('.html')
    const path = href.substring(start + 9, end)

    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      path: path
    }
  }

  render () {
    return (
      <Router>
        <Redirect
          to={{
            pathname: '/' + this.state.path,
            state: {from: '/'}
          }}
        />
        <div className={'padding-top-20px dashboardContainer'}>

          <Switch>
            <Route path='/dashboard'>
              <Dashboard user={this.state.user} />
            </Route>
            <Route exact path='/virtual-machine-list'>
              <VirtualMachineList user={this.state.user} />
            </Route>
            <Route exact path='/virtual-machine-list'>
              <TaskConsole user={this.state.user} />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}
