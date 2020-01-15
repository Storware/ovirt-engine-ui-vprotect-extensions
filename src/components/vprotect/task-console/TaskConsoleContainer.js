import React from 'react'
import {TaskConsole} from './TaskConsole'

export class TaskConsoleContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    }
  }

  render () {
    return (
      <div>
        <div className={'container-fluid'}>
          <ol className='breadcrumb'>
            <li>
              VM Backup
            </li>
            <li>
              <a href='/ovirt-engine/webadmin/?locale=en_US#vprotect-task-console'>Task console</a>
            </li>
          </ol>
        </div>
        <div>
          <TaskConsole user={this.state.user} />
        </div>
      </div>
    )
  }
}
