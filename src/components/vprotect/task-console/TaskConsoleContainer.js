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
      <div className={'padding-top-20px'}>
        <TaskConsole user={this.state.user} />
      </div>
    )
  }
}
