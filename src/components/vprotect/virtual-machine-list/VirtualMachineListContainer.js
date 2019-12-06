import React from 'react'
import {VirtualMachineList} from './VirtualMachineList'
import {VprotectService} from '../../../services/vprotect-service'

export class VirtualMachineListContainer extends React.Component {
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
        <VirtualMachineList user={this.state.user}/>
      </div>
    )
  }
}
