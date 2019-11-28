import React from 'react'
import PropTypes from 'prop-types'
import { bindMethods, excludeKeys, filterKeys, noop, Button, Spinner } from 'patternfly-react'
import VmMigrateModalBody from './VmMigrateModalBody'
import StatefulModalPattern from '../StatefulModalPattern'

class VmMigrateModal extends StatefulModalPattern {
  constructor (props) {
    super(props)
    bindMethods(this, ['onHostSelectionChange', 'onMigrateVmsInAffinityChange'])
    this.state = {
      ...this.state,
      migrateVmsInAffinity: false
    }
  }

  onHostSelectionChange (newHostId) {
    this._hostId = newHostId
  }

  onMigrateVmsInAffinityChange (migrateVmsInAffinity) {
    this.setState({ migrateVmsInAffinity: migrateVmsInAffinity })
    this.props.refreshHosts(migrateVmsInAffinity)
  }

  getModalPatternProps () {
    // TODO(vs) check if the latest patternfly-react version has 'includeKeys'
    // to complement the existing 'excludeKeys' helper, post a PR otherwise
    return filterKeys(this.props, key => Object.keys(StatefulModalPattern.propTypes).includes(key))
  }

  render () {
    const {
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
      migrateToHost,
      isLoading,
      migrateButtonLabel,
      cancelButtonLabel
    } = this.props

    const onMigrateButtonClick = () => {
      const hostId = this._hostId ||
        (hostAutoSelectItem && hostAutoSelectItem.value) ||
        (hostSelectItems.length > 0 && hostSelectItems[0].value)

      migrateToHost(hostId, this.state.migrateVmsInAffinity)
      this.close()
    }

    const modalBody = (
      <Spinner loading={isLoading}>
        <VmMigrateModalBody
          vmInfoLabel={vmInfoLabel}
          vmListLabel={vmListLabel}
          vmListShowAllLabel={vmListShowAllLabel}
          vmListShowLessLabel={vmListShowLessLabel}
          vmNames={vmNames}
          hostSelectLabel={hostSelectLabel}
          hostSelectFieldHelp={hostSelectFieldHelp}
          hostSelectItems={hostSelectItems}
          hostAutoSelectItem={hostAutoSelectItem}
          affinityText={affinityText}
          migrateVmsInAffinity={this.state.migrateVmsInAffinity}
          onHostSelectionChange={this.onHostSelectionChange}
          onMigrateVmsInAffinityChange={this.onMigrateVmsInAffinityChange}
        />
      </Spinner>
    )

    const modalButtons = (
      <React.Fragment>
        <Button onClick={this.close}>
          {cancelButtonLabel}
        </Button>
        <Button
          bsStyle='primary'
          onClick={onMigrateButtonClick}
          disabled={hostSelectItems.length === 0}
        >
          {migrateButtonLabel}
        </Button>
      </React.Fragment>
    )

    return React.cloneElement(super.render(), {
      children: modalBody,
      footer: modalButtons
    })
  }
}

VmMigrateModal.propTypes = {
  ...excludeKeys(StatefulModalPattern.propTypes, ['children', 'footer']),
  ...excludeKeys(VmMigrateModalBody.propTypes, ['onHostSelectionChange']),
  migrateToHost: PropTypes.func,
  isLoading: PropTypes.bool,
  migrateButtonLabel: PropTypes.string,
  cancelButtonLabel: PropTypes.string
}

VmMigrateModal.defaultProps = {
  ...excludeKeys(StatefulModalPattern.defaultProps, ['children', 'footer']),
  ...excludeKeys(VmMigrateModalBody.defaultProps, ['onHostSelectionChange']),
  dialogClassName: 'modal-lg',
  title: 'Migrate VM(s)',
  migrateToHost: noop,
  isLoading: false,
  migrateButtonLabel: 'Migrate',
  cancelButtonLabel: 'Cancel'
}

export default VmMigrateModal
