import React from 'react'
import { msg } from '_/intl-messages'
import config from '_/plugin-config'
import { showModal } from '_/utils/react-modals'

import VmMigrateDataProvider from '_/components/modals/vm/VmMigrateDataProvider'
import VmMigrateModal from '_/components/modals/vm/VmMigrateModal'
import { hostAutoSelectItemValue } from '_/components/modals/vm/VmMigrateModalBody'

function showVmMigrateModal (upVms) {
  showModal(({ container, destroyModal }) => (
    <VmMigrateDataProvider vmIds={upVms.map(vm => vm.id)}>
      <VmMigrateModal
        show
        container={container}
        onExited={destroyModal}
        title={msg.migrateVmDialogTitle()}
        vmInfoLabel={msg.migrateVmInfoLabel({
          value: config.useFakeData ? 1337 : upVms.length
        })}
        vmListLabel={msg.migrateVmListLabel()}
        vmListShowAllLabel={msg.migrateVmListShowAllLabel()}
        vmListShowLessLabel={msg.migrateVmListShowLessLabel()}
        hostSelectLabel={msg.migrateVmSelectHostLabel()}
        hostSelectFieldHelp={msg.migrateVmSelectHostFieldHelp()}
        hostAutoSelectItem={{
          value: hostAutoSelectItemValue,
          text: msg.migrateVmAutoSelectHost()
        }}
        affinityText={{
          label: msg.migrateVmAffinityLabel(),
          labelHelp: msg.migrateVmAffinityLabelHelp(),
          checkbox: msg.migrateVmAffinityCheckbox()
        }}
        migrateButtonLabel={msg.migrateVmButton()}
        cancelButtonLabel={msg.cancelButton()}
      />
    </VmMigrateDataProvider>
  ))
}

export {
  showVmMigrateModal
}
