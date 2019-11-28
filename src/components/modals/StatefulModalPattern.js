import React from 'react'
import ModalPattern from './ModalPattern'
import { bindMethods, propOrState, excludeKeys } from 'patternfly-react'

// TODO(vs) remove once patternfly-react PR is merged:
//  https://github.com/patternfly/patternfly-react/pull/343

class StatefulModalPattern extends React.Component {
  static getDerivedStateFromProps (nextProps, prevState) {
    return {
      show: propOrState(nextProps, prevState, 'show')
    }
  }

  constructor (props) {
    super(props)
    this.state = { show: false }
    bindMethods(this, ['open', 'close'])
  }

  open () {
    this.setState({ show: true })
  }

  close () {
    this.setState({ show: false })
  }

  getModalPatternProps () {
    return this.props
  }

  render () {
    return (
      <ModalPattern
        {...this.getModalPatternProps()}
        show={this.state.show}
        onClose={this.close}
      />
    )
  }
}

StatefulModalPattern.propTypes = {
  ...excludeKeys(ModalPattern.propTypes, ['onClose'])
}

StatefulModalPattern.defaultProps = {
  ...excludeKeys(ModalPattern.defaultProps, ['onClose', 'show'])
}

export default StatefulModalPattern
