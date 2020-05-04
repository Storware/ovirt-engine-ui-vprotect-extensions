import React from 'react'
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom'
import PoliciesList from './policies-list/PoliciesList'
import Policy from './policy/Policy'
import PropTypes from 'prop-types'

class Policies extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact path={this.props.match.path}>
          <PoliciesList />
        </Route>
        <Route path={`${this.props.match.path}/:guid`}>
          <Policy />
        </Route>
      </Switch>
    )
  }
}

Policies.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(Policies)
