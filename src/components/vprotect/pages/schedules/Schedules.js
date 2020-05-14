import React from 'react'
import {
  Switch,
  Route,
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'
import SchedulesList from './schedules-list/SchedulesList'
import Schedule from './schedule/Schedule'

class Schedules extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact path={this.props.match.path}>
          <SchedulesList />
        </Route>
        <Route path={`${this.props.match.path}/:guid`}>
          <Schedule />
        </Route>
      </Switch>
    )
  }
}

Schedules.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(Schedules)
