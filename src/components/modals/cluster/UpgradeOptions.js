import React from 'react'
import PropTypes from 'prop-types'
import { propNamesToType } from '../../../utils/react'

import {
  Grid,
  Form,
  FormControl,
  Checkbox
} from 'patternfly-react'
import BaseFormGroup from '../../forms/BaseFormGroup'

/**
 * Display the set of options that may be user configured for the cluster upgrade.
 *
 * This is a purely controlled input component.
 */
class UpgradeOptions extends React.Component {
  constructor (props) {
    super(props)
    this.onFieldChange = this.onFieldChange.bind(this)
  }

  onFieldChange ({ target }) {
    const id = target.id
    const value =
      target.type === 'checkbox' ? target.checked
        : target.type === 'number' ? Number.parseInt(target.value, 10)
          : target.value

    const optionName =
      id === 'upgrade-options-stop-pinned-vms' ? 'stopPinnedVms'
        : id === 'upgrade-options-upgrade-timeout' ? 'upgradeTimeoutInMin'
          : id === 'upgrade-options-check-upgrade' ? 'checkForUpgradesOnHosts'
            : id === 'upgrade-options-reboot-after' ? 'rebootAfterUpgrade'
              : id === 'upgrade-options-use-maintenance' ? 'useMaintenanceClusterPolicy'
                : undefined

    if (!optionName) {
      throw Error(`Unknown field was changed, id: ${id}`)
    }

    this.props.onChange(optionName, value)
  }

  render () {
    const {
      stopPinnedVms,
      upgradeTimeoutInMin,
      checkForUpgradesOnHosts,
      rebootAfterUpgrade,
      useMaintenanceClusterPolicy
    } = this.props

    return (
      <Grid fluid className='clusterUpgradeWizard-UpgradeOptions'>
        <Form horizontal>
          <BaseFormGroup
            id='upgrade-options-stop-pinned-vms'
            label={this.props.stopPinnedLabel}
            fieldHelpPlacement='right'
            fieldHelp={this.props.stopPinnedFieldHelp}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-stop-pinned-vms'
              checked={stopPinnedVms}
              onChange={this.onFieldChange}
            >
              {this.props.stopPinnedDescription}
            </Checkbox>
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-upgrade-timeout'
            label={this.props.upgradeTimeoutLabel}
            fieldHelpPlacement='right'
            fieldHelp={this.props.upgradeTimeoutFieldHelp}
            labelCols={4}
            fieldCols={8}
          >
            <FormControl
              type='number'
              min='0'
              className='timeoutInput'
              value={Number.isNaN(upgradeTimeoutInMin) ? '' : upgradeTimeoutInMin}
              onChange={this.onFieldChange}
            />
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-check-upgrade'
            label={this.props.checkUpgradeLabel}
            fieldHelpPlacement='right'
            fieldHelp={this.props.checkUpgradeFieldHelp}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-check-upgrade'
              checked={checkForUpgradesOnHosts}
              onChange={this.onFieldChange}
            >
              {this.props.checkUpgradeDescription}
            </Checkbox>
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-reboot-after'
            label={this.props.rebootAfterLabel}
            fieldHelpPlacement='right'
            fieldHelp={this.props.rebootAfterFieldHelp}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-reboot-after'
              checked={rebootAfterUpgrade}
              onChange={this.onFieldChange}
            >
              {this.props.rebootAfterDescription}
            </Checkbox>
          </BaseFormGroup>

          <BaseFormGroup
            id='upgrade-options-use-maintenance'
            label={this.props.useMaintenancePolicyLabel}
            fieldHelpPlacement='right'
            fieldHelp={this.props.useMaintenancePolicyFieldHelp}
            labelCols={4}
            fieldCols={8}
          >
            <Checkbox
              id='upgrade-options-use-maintenance'
              checked={useMaintenanceClusterPolicy}
              onChange={this.onFieldChange}
            >
              {this.props.useMaintenancePolicyDescription}
            </Checkbox>
          </BaseFormGroup>
        </Form>
      </Grid>
    )
  }
}

UpgradeOptions.i18nProps = {
  stopPinnedLabel: 'Stop Pinned VMs',
  stopPinnedFieldHelp:
    'Specify whether to stop virtual machines pinned to the host being' +
    ' upgraded. If checked, the pinned non-migratable virtual machines will' +
    ' be stopped and host will be upgraded, otherwise the host will be skipped.',
  stopPinnedDescription: 'Stop Virtual Machines pinned to Hosts',

  upgradeTimeoutLabel: 'Upgrade Timeout (Minutes)',
  upgradeTimeoutFieldHelp:
    'Timeout in minutes to wait for an individual host to be upgraded.' +
    ' The default is 60 minutes (1 hour).',

  checkUpgradeLabel: 'Check Upgrade',
  checkUpgradeFieldHelp:
    'If checked, run check_for_upgrade action on all hosts before executing' +
    ' upgrade on them. If unchecked, run upgrade only for hosts with available' +
    ' upgrades and ignore all other hosts.',
  checkUpgradeDescription: 'Check for upgrades on all Hosts (If not, only upgrade Hosts with known upgrades)',

  rebootAfterLabel: 'Reboot After Upgrade',
  rebootAfterFieldHelp: 'If checked reboot hosts after successful upgrade.',
  rebootAfterDescription: 'Reboot Hosts after upgrade',

  useMaintenancePolicyLabel: 'Use Maintenance Policy',
  useMaintenancePolicyFieldHelp:
    'If checked the cluster\'s policy will be switched to "maintenance" during' +
    ' the upgrade. If not checked the policy will be unchanged.',
  useMaintenancePolicyDescription: 'Switch Cluster policy to Cluster Maintenance during upgrade'
}

UpgradeOptions.propTypes = {
  stopPinnedVms: PropTypes.bool,
  upgradeTimeoutInMin: PropTypes.number,
  checkForUpgradesOnHosts: PropTypes.bool,
  rebootAfterUpgrade: PropTypes.bool,
  useMaintenanceClusterPolicy: PropTypes.bool,

  onChange: PropTypes.func.isRequired,

  ...propNamesToType(UpgradeOptions.i18nProps, PropTypes.string)
}

UpgradeOptions.defaultProps = {
  stopPinnedVms: true,
  upgradeTimeoutInMin: 60,
  checkForUpgradesOnHosts: false,
  rebootAfterUpgrade: true,
  useMaintenanceClusterPolicy: true,

  ...UpgradeOptions.i18nProps
}

export default UpgradeOptions
