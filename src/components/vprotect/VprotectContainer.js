import React from 'react'
import {VirtualMachineList} from './VirtualMachineList'
import {VprotectService} from '../../services/vprotect-service'
import getPluginApi from '../../plugin-api'

const username = getPluginApi().configObject().username
const password = getPluginApi().configObject().password

export class VprotectContainer extends React.Component {
  vprotectService = new VprotectService()

  constructor (props) {
    super(props)

    this.state = {
      loggedIn: false
    }

    this.vprotectService.login(username, password).then(() => this.setState({loggedIn: true}))
  }

  render () {
    return (
      <div className={'vprotectContainer'}>
        {this.state.loggedIn && <VirtualMachineList />}
      </div>
    )
  }
}
