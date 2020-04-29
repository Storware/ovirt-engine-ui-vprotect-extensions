import React from 'react'
import {
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'
import {vprotectService} from '../../../../services/vprotect-service'
import {InputText} from 'primereact/inputtext'
import {ToggleButton} from 'primereact/togglebutton'

class Policy extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      model: {}
    }

    vprotectService.getPolicy('vm-backup', this.props.match.params.guid).then(result => {
      this.setState({model: result})
      console.log(result)
    })
  }

  handle = (name, e) => {
    this.setState({
      ...this.state,
      model: {
        [name]: e.target.value
      }
    })
  }

  render () {
    return this.state.model ? (
      <div>
        <div>
          <h3>Name</h3>
          <InputText value={this.state.model.name} onChange={(e) => this.handle('name', e)} />
        </div>
        <div>
          <h3>Auto remove non-present Virtual Environments</h3>
          <ToggleButton checked={this.state.autoRemoveNonPresent} onChange={(e) => this.handle('autoRemoveNonPresent', e)} />
        </div>
      </div>
    ) : (
      <div>
        loading
      </div>
    )
  }
}

Policy.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(Policy)
