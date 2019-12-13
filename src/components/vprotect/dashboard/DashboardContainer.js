import React from 'react'
import {Dashboard} from './Dashboard'

export class DashboardContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      user: JSON.parse(localStorage.getItem('user'))
    }
  }

  render () {
    return (
      <div className={'padding-top-20px dashboardContainer'}>
        <Dashboard user={this.state.user} />
      </div>
    )
  }
}
