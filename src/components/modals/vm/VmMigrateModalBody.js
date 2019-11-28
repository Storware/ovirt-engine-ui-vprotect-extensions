import React from 'react'
import PropTypes from 'prop-types'
import { noop, Form, Grid, Checkbox } from 'patternfly-react'
import { randomId } from '../../../utils/random'
import BaseFormGroup from '../../forms/BaseFormGroup'
import SelectFormGroup, { selectItemShape } from '../../forms/SelectFormGroup'
import VmListFormGroup, { VmList } from '../../forms/VmListFormGroup'
import { msg } from '../../../intl-messages'

const NO_HOST_AVAILABLE_HOST_ITEMS = [{
  text: msg.migrateVmNoAvailableHost(),
  value: '__NO_HOST__'
}]

const VmMigrateModalBody = ({
  vmInfoLabel,
  vmListLabel,
  vmListShowAllLabel,
  vmListShowLessLabel,
  vmNames,
  hostSelectLabel,
  hostSelectFieldHelp,
  hostSelectItems,
  hostAutoSelectItem,
  affinityText,
  migrateVmsInAffinity,
  onHostSelectionChange,
  onMigrateVmsInAffinityChange
}) => {
  const items = hostAutoSelectItem
    ? [hostAutoSelectItem].concat(hostSelectItems)
    : hostSelectItems

  const migrationDisabled = hostSelectItems.length === 0

  return (
    <Grid fluid>
      <Grid.Row>
        <Grid.Col sm={12}>
          <div className={'form-group'}>
            {vmInfoLabel || `Migrate ${vmNames.length} Virtual Machines to the selected Host.`}
          </div>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col sm={12}>
          <Form horizontal>
            <SelectFormGroup
              id={randomId()}
              label={hostSelectLabel}
              fieldHelp={hostSelectFieldHelp}
              fieldHelpPlacement={'right'}
              items={migrationDisabled ? NO_HOST_AVAILABLE_HOST_ITEMS : items}
              defaultValue={hostAutoSelectItem && hostAutoSelectItem.value}
              disabled={migrationDisabled}
              usePlaceholder={false}
              onChange={event => { onHostSelectionChange(event.target.value) }}
            />

            <BaseFormGroup
              id={randomId()}
              label={affinityText.label}
              fieldHelpPlacement='right'
              fieldHelp={affinityText.labelHelp}
            >
              <Checkbox
                id={randomId()}
                checked={migrateVmsInAffinity}
                onChange={event => { onMigrateVmsInAffinityChange(event.target.checked) }}
              >
                {affinityText.checkbox}
              </Checkbox>
            </BaseFormGroup>

            <VmListFormGroup
              id={randomId()}
              label={vmListLabel}
              vmNames={vmNames}
              showAllThreshold={10}
              showAllLabel={vmListShowAllLabel}
              showLessLabel={vmListShowLessLabel}
            />
          </Form>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  )
}

export const hostAutoSelectItemValue = '_AutoSelect_'

VmMigrateModalBody.propTypes = {
  vmInfoLabel: PropTypes.string,
  vmListLabel: PropTypes.string,
  vmListShowAllLabel: PropTypes.string,
  vmListShowLessLabel: PropTypes.string,
  vmNames: PropTypes.arrayOf(PropTypes.string),
  hostSelectLabel: PropTypes.string,
  hostSelectFieldHelp: PropTypes.string,
  hostSelectItems: PropTypes.arrayOf(PropTypes.shape(selectItemShape)),
  hostAutoSelectItem: PropTypes.shape(selectItemShape),
  affinityText: PropTypes.shape({
    label: PropTypes.string.isRequired,
    labelHelp: PropTypes.string.isRequired,
    checkbox: PropTypes.string.isRequired
  }),
  migrateVmsInAffinity: PropTypes.bool,
  onHostSelectionChange: PropTypes.func,
  onMigrateVmsInAffinityChange: PropTypes.func
}

VmMigrateModalBody.defaultProps = {
  vmInfoLabel: null,
  vmListLabel: 'Virtual Machines',
  vmListShowAllLabel: VmList.defaultProps.showAllLabel,
  vmListShowLessLabel: VmList.defaultProps.showLessLabel,
  vmNames: [],
  hostSelectLabel: 'Destination Host',
  hostSelectFieldHelp: 'Select \'Automatically Choose Host\' to allow the application to select the best suited Host for these Virtual Machines to migrate to.',
  hostSelectItems: [],
  hostAutoSelectItem: {
    value: hostAutoSelectItemValue,
    text: 'Automatically Choose Host'
  },
  affinityText: {
    label: 'Migrate VMs in affinity',
    labelHelp: 'This will migrate also VMs that are not shown in the list below. If the selected VMs are in an affinity together, there may be errors in the log, because it will try to initiate a migration multiple times.',
    checkbox: 'Migrate all VMs in positive enforcing affinity with selected VMs.'
  },
  migrateVmsInAffinity: false,
  onHostSelectionChange: noop,
  onMigrateVmsInAffinityChange: noop
}

export default VmMigrateModalBody
