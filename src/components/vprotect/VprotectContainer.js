import React from 'react'
import {VirtualMachineList} from './VirtualMachineList'

export class VprotectContainer extends React.Component {
  render () {
    return (
      <div className={'vprotectContainer'}>
        <VirtualMachineList />
      </div>
    )
  }
}
