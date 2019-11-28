import React from 'react'
import { msg, l10n } from '_/intl-messages'
import { showModal } from '_/utils/react-modals'

import ClusterUpgradeDataProvider from '_/components/modals/cluster/ClusterUpgradeDataProvider'
import ClusterUpgradeWizard from '_/components/modals/cluster/ClusterUpgradeWizard'

function showClusterUpgradeWizard ({ id, name }) {
  showModal(({ container, destroyModal }) => (
    <ClusterUpgradeDataProvider cluster={{ id, name }}>
      <ClusterUpgradeWizard
        show
        container={container}
        onExited={destroyModal}
        title={msg.clusterUpgradeTitle({ clusterName: name })}
        loadingTitle={l10n.clusterUpgradeLoadingTitle()}
        loadingMessage={l10n.clusterUpgradeLoadingMessage()}
        clusterInMaintenaceTitle={l10n.clusterUpgradeClusterInMaintenaceTitle()}
        clusterInMaintenaceMessage={msg.clusterUpgradeClusterInMaintenaceMessage({ clusterName: name })}
        clusterInMaintenaceContinue={l10n.clusterUpgradeClusterInMaintenaceContinue()}
        cancelButtonText={l10n.clusterUpgradeCancelButtonText()}
        backButtonText={l10n.clusterUpgradeBackButtonText()}
        nextButtonText={l10n.clusterUpgradeNextButtonText()}
        upgradeButtonText={l10n.clusterUpgradeUpgradeButtonText()}
        stepSelectHostsLabel={l10n.clusterUpgradeStepSelectHostsLabel()}
        stepUpgradeOptionsLabel={l10n.clusterUpgradeStepUpgradeOptionsLabel()}
        stepReviewLabel={l10n.clusterUpgradeStepReviewLabel()}
        noHostsMessage={l10n.clusterUpgradeNoHostsMessage()}
        selectHostsMessage={l10n.clusterUpgradeSelectHostsMessage()}
        hostTableHeaderStatus={l10n.clusterUpgradeHostTableHeaderStatus()}
        hostTableHeaderName={l10n.clusterUpgradeHostTableHeaderName()}
        hostTableHeaderHostname={l10n.clusterUpgradeHostTableHeaderHostname()}
        hostTableHeaderVMs={l10n.clusterUpgradeHostTableHeaderVMs()}
        stopPinnedLabel={l10n.clusterUpgradeStopPinnedLabel()}
        stopPinnedFieldHelp={l10n.clusterUpgradeStopPinnedFieldHelp()}
        stopPinnedDescription={l10n.clusterUpgradeStopPinnedDescription()}
        upgradeTimeoutLabel={l10n.clusterUpgradeUpgradeTimeoutLabel()}
        upgradeTimeoutFieldHelp={l10n.clusterUpgradeUpgradeTimeoutFieldHelp()}
        checkUpgradeLabel={l10n.clusterUpgradeCheckUpgradeLabel()}
        checkUpgradeFieldHelp={l10n.clusterUpgradeCheckUpgradeFieldHelp()}
        checkUpgradeDescription={l10n.clusterUpgradeCheckUpgradeDescription()}
        rebootAfterLabel={l10n.clusterUpgradeRebootAfterLabel()}
        rebootAfterFieldHelp={l10n.clusterUpgradeRebootAfterFieldHelp()}
        rebootAfterDescription={l10n.clusterUpgradeRebootAfterDescription()}
        useMaintenancePolicyLabel={l10n.clusterUpgradeUseMaintenancePolicyLabel()}
        useMaintenancePolicyFieldHelp={l10n.clusterUpgradeUseMaintenancePolicyFieldHelp()}
        useMaintenancePolicyDescription={l10n.clusterUpgradeUseMaintenancePolicyDescription()}
        hostsLabel={l10n.clusterUpgradeHostsLabel()}
        hostsDescription={l10n.clusterUpgradeHostsDescription()}
        nonMigratableLabel={l10n.clusterUpgradeNonMigratableLabel()}
        nonMigratableDescription={l10n.clusterUpgradeNonMigratableDescription()}
        migrateLabel={l10n.clusterUpgradeMigrateLabel()}
        migrateDescription={l10n.clusterUpgradeMigrateDescription()}
      />
    </ClusterUpgradeDataProvider>
  ))
}

export {
  showClusterUpgradeWizard
}
