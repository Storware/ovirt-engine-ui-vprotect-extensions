import React from 'react'
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'
import VirtualMachinesList from './virtual-machines-list/VirtualMachinesList'
import VirtualMachine from './virtual-machine/VirtualMachine'

class VirtualMachines extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact path={this.props.match.path}>
          <VirtualMachinesList />
        </Route>
        <Route path={`${this.props.match.path}/:guid`}>
          <VirtualMachine />
        </Route>
      </Switch>
    )
  }
}

VirtualMachines.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(VirtualMachines)
