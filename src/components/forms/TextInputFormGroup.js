import React from 'react'
import { excludeKeys, Form } from 'patternfly-react'
import BaseFormGroup from './BaseFormGroup'

const TextInputFormGroup = ({
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
    <Form.FormControl type='text' {...props} />
  </BaseFormGroup>
)

TextInputFormGroup.propTypes = {
  ...excludeKeys(BaseFormGroup.propTypes, ['children'])
}

export default TextInputFormGroup
