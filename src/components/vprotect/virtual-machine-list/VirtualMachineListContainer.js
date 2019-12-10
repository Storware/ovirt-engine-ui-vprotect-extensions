import React from 'react'
import {VirtualMachineList} from './VirtualMachineList'

export class VirtualMachineListContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    }
  }

  render () {
    return (
      <div className={'padding-top-20px'}>
        <VirtualMachineList user={this.state.user}/>
      </div>
    )
  }
}
