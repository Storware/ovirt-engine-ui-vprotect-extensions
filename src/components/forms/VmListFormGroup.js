import React from 'react'
import PropTypes from 'prop-types'
import { excludeKeys, Form } from 'patternfly-react'
import BaseFormGroup from './BaseFormGroup'

export class VmList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { showAll: false }
  }

  render () {
    const { vmNames, showAllThreshold, showAllLabel, showLessLabel } = this.props
    const { showAll } = this.state

    const vmNamesToShow = showAll ? vmNames : vmNames.slice(0, showAllThreshold)
    const showLink = vmNames.length > showAllThreshold

    return (
      <div>
        {vmNamesToShow.map(name => (
          <div key={name}>{name}</div>
        ))}
        {showLink && (
          <a href='#' onClick={event => {
            event.preventDefault()
            this.setState({ showAll: !showAll })
          }}>
            {showAll ? showLessLabel : showAllLabel}
          </a>
        )}
      </div>
    )
  }
}

VmList.propTypes = {
  vmNames: PropTypes.arrayOf(PropTypes.string),
  showAllThreshold: PropTypes.number,
  showAllLabel: PropTypes.string,
  showLessLabel: PropTypes.string
}

VmList.defaultProps = {
  vmNames: [],
  showAllThreshold: 10,
  showAllLabel: 'Show all Virtual Machines',
  showLessLabel: 'Show less Virtual Machines'
}

const VmListFormGroup = ({
  id,
  label,
  help,
  fieldHelp,
  fieldHelpPlacement,
  validationState,
  ...props
}) => (
  <BaseFormGroup
    id={id}
    label={label}
    help={help}
    fieldHelp={fieldHelp}
    fieldHelpPlacement={fieldHelpPlacement}
    validationState={validationState}
  >
    <Form.FormControl componentClass={VmList} {...props} />
  </BaseFormGroup>
)

VmListFormGroup.propTypes = {
  ...excludeKeys(BaseFormGroup.propTypes, ['children'])
}

export default VmListFormGroup
