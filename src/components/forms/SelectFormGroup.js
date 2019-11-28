import React from 'react'
import PropTypes from 'prop-types'
import { excludeKeys, Form } from 'patternfly-react'
import BaseFormGroup from './BaseFormGroup'

const SelectFormGroup = ({
  id,
  label,
  help,
  fieldHelp,
  fieldHelpPlacement,
  validationState,
  items,
  usePlaceholder,
  placeholderValue,
  placeholderText,
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
    <Form.FormControl componentClass='select' {...props}>
      {usePlaceholder && (
        <option value={placeholderValue}>{placeholderText}</option>
      )}
      {items.map(item => (
        <option key={item.value} value={item.value}>
          {item.text}
        </option>
      ))}
    </Form.FormControl>
  </BaseFormGroup>
)

export const selectItemShape = {
  value: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

SelectFormGroup.propTypes = {
  ...excludeKeys(BaseFormGroup.propTypes, ['children']),
  items: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  usePlaceholder: PropTypes.bool,
  placeholderValue: PropTypes.string,
  placeholderText: PropTypes.string
}

SelectFormGroup.defaultProps = {
  items: [],
  usePlaceholder: true,
  placeholderValue: '_select_',
  placeholderText: '(select)'
}

export default SelectFormGroup
