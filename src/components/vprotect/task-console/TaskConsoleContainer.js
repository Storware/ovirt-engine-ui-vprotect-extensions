import React from 'react'
import {TaskConsole} from './TaskConsole'
import {VprotectService} from '../../../services/vprotect-service'

export class TaskConsoleContainer extends React.Component {
  vprotectService = new VprotectService()

  constructor (props) {
    super(props)

    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    }
  }

  render () {
    return (
      <div className={'vprotectContainer'}>
        <TaskConsole user={this.state.user}/>
      </div>
    )
  }
}
