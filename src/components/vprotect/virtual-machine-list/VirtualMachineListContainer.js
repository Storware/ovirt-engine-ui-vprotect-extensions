import React from 'react'
import {VirtualMachineList} from './VirtualMachineList'

export class VirtualMachineListContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    }

    console.log(window.location)
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
              <a href='/ovirt-engine/webadmin/?locale=en_US#vprotect-virtual-machine-list'>Virtual Machines</a>
            </li>
          </ol>
        </div>
        <div>
          <VirtualMachineList user={this.state.user} />
        </div>
      </div>
    )
  }
}
