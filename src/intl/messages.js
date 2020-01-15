/**
 * Defines all of the localized strings used in the application.
 *
 * Every key becomes a function that will format the text in the currently configured
 * locale at runtime.
 *
 * Example common message (key has no prefix):
 * ```
 * stringName: {
 *   id: 'common.stringName',
 *   defaultMessage: 'English text',
 *   description: 'Hint for translators to understand where the string is used in the app'
 * }
 * ```
 *
 * Example context-specific message (key has context-specific prefix):
 * ```
 * dashboardStringName: {
 *   id: 'dashboard.stringName',
 *   defaultMessage: 'English text',
 *   description: 'Hint for translators to understand where the string is used in the app'
 * }
 * ```
 */
const messageDescriptors = {

  // common strings

  closeButton: {
    id: 'common.closeButton',
    defaultMessage: 'Close',
    description: 'label of `Close` button used in dialogs'
  },

  okButton: {
    id: 'common.okButton',
    defaultMessage: 'OK',
    description: 'label of `OK` button used in dialogs'
  },

  cancelButton: {
    id: 'common.cancelButton',
    defaultMessage: 'Cancel',
    description: 'label of `Cancel` button used in dialogs'
  },

  notAvailableShort: {
    id: 'common.notAvailableShort',
    defaultMessage: 'N/A',
    description: 'shorthand for `Not Available`'
  },

  cpuTitle: {
    id: 'common.cpuTitle',
    defaultMessage: 'CPU',
    description: 'title `CPU` used in various components'
  },

  memoryTitle: {
    id: 'common.memoryTitle',
    defaultMessage: 'Memory',
    description: 'title `Memory` used in various components'
  },

  storageTitle: {
    id: 'common.storageTitle',
    defaultMessage: 'Storage',
    description: 'title `Storage` used in various components'
  },

  vdoSavingsTitle: {
    id: 'common.vdoSavingsTitle',
    defaultMessage: 'Storage Savings',
    description: 'title `VDO Savings` used in various components'
  },

  vprotectTitle: {
    id: 'common.vprotectTitle',
    defaultMessage: 'VM Backup',
    description: 'title `VM Backup` used in various components'
  },

  vprotectVirtualMachinesTitle: {
    id: 'common.vprotectVirtualMachinesTitle',
    defaultMessage: 'Virtual Machines',
    description: 'title `Virtual Machines` used in various components'
  },

  vprotectDashboardTitle: {
    id: 'common.vprotectDashboardTitle',
    defaultMessage: 'Dashboard',
    description: 'title `Dashboard` used in various components'
  },

  vprotectTaskConsoleTitle: {
    id: 'common.vprotectTaskConsoleTitle',
    defaultMessage: 'Task Console',
    description: 'title `Task Console` used in various components'
  },

  vprotectBackupHistoryListTitle: {
    id: 'common.vprotectBackupHistoryListTitle',
    defaultMessage: 'Backup history list',
    description: 'title `Backup history list` used in various components'
  },

  used: {
    id: 'common.used',
    defaultMessage: 'Used',
    description: 'label that indicates current usage in various components'
  },

  unitUsed: {
    id: 'common.unitUsed',
    defaultMessage: '{unit} Used',
    description: 'label that indicates current usage in various components'
  },

  percentUsed: {
    id: 'common.percentUsed',
    defaultMessage: '{value, number}% Used',
    description: 'label that indicates current usage in various components'
  },

  available: {
    id: 'common.available',
    defaultMessage: 'Available',
    description: 'label that indicates available (total - used) value in various components'
  },

  unitAvailable: {
    id: 'common.unitAvailable',
    defaultMessage: '{unit} Available',
    description: 'label that indicates available (total - used) value in various components'
  },

  percentAvailable: {
    id: 'common.percentAvailable',
    defaultMessage: '{value, number}% Available',
    description: 'label that indicates available (total - used) value in various components'
  },

  usedOfTotal: {
    id: 'common.usedOfTotal',
    defaultMessage: '{used, number} of {total, number}',
    description: 'text shown to compare currently used vs. total value'
  },

  // dashboard related strings

  dashboardTitle: {
    id: 'dashboard.title',
    defaultMessage: 'Dashboard',
    description: 'title of the Dashboard place'
  },

  dashboardDataLoading: {
    id: 'dashboard.dataLoading',
    defaultMessage: 'Loading data...',
    description: 'title shown when Dashboard place is currently loading data'
  },

  dashboardDataError: {
    id: 'dashboard.dataError',
    defaultMessage: 'Error!',
    description: 'title shown when Dashboard place failed to load data'
  },

  dashboardDataErrorDetail: {
    id: 'dashboard.dataErrorDetail',
    defaultMessage: 'Could not fetch dashboard data. Please ensure that data warehouse is properly installed and configured.',
    description: 'detail shown when Dashboard place failed to load data'
  },

  dashboardRefreshButtonTooltip: {
    id: 'dashboard.refreshButtonTooltip',
    defaultMessage:
      'Manually refresh dashboard. With default server settings, status card' +
      ' data is updated once a minute and utilization data is updated once every 5 minutes.',
    description: 'tooltip on the refresh button to explain it is manual update and with what frequency the data is updated'
  },

  dashboardLastUpdated: {
    id: 'dashboard.lastUpdated',
    defaultMessage: 'Last Updated',
    description: 'label that indicates date/time of last dashboard data update'
  },

  dashboardGlobalUtilizationHeading: {
    id: 'dashboard.globalUtilizationHeading',
    defaultMessage: 'Global Utilization',
    description: 'heading of `Global Utilization` section'
  },

  dashboardClusterUtilizationHeading: {
    id: 'dashboard.clusterUtilizationHeading',
    defaultMessage: 'Cluster Utilization',
    description: 'heading of `Cluster Utilization` section'
  },

  dashboardStorageUtilizationHeading: {
    id: 'dashboard.storageUtilizationHeading',
    defaultMessage: 'Storage Utilization',
    description: 'heading of `Storage Utilization` section'
  },
  dashboardVdoSavingsHeading: {
    id: 'dashboard.vdoSavingsHeading',
    defaultMessage: 'Storage Savings',
    description: 'heading of `VDO Savings` section'
  },
  dashboardStatusCardDataCenterTitle: {
    id: 'dashboard.statusCardDataCenterTitle',
    defaultMessage: 'Data Centers',
    description: 'title of `Data Centers` status card'
  },

  dashboardStatusCardClusterTitle: {
    id: 'dashboard.statusCardClusterTitle',
    defaultMessage: 'Clusters',
    description: 'title of `Clusters` status card'
  },

  dashboardStatusCardHostTitle: {
    id: 'dashboard.statusCardHostTitle',
    defaultMessage: 'Hosts',
    description: 'title of `Hosts` status card'
  },

  dashboardStatusCardStorageTitle: {
    id: 'dashboard.statusCardStorageTitle',
    defaultMessage: 'Data Storage Domains',
    description: 'title of `Data Storage Domains` status card'
  },

  dashboardStatusCardGlusterVolumeTitle: {
    id: 'dashboard.statusCardGlusterVolumeTitle',
    defaultMessage: 'Gluster Volumes',
    description: 'title of `Gluster Volumes` status card'
  },

  dashboardStatusCardVmTitle: {
    id: 'dashboard.statusCardVmTitle',
    defaultMessage: 'Virtual Machines',
    description: 'title of `Virtual Machines` status card'
  },

  dashboardStatusCardEventTitle: {
    id: 'dashboard.statusCardEventTitle',
    defaultMessage: 'Events',
    description: 'title of `Events` status card'
  },

  dashboardStatusTypeUp: {
    id: 'dashboard.statusTypeUp',
    defaultMessage: 'Up',
    description: 'text shown for `Up` status'
  },

  dashboardStatusTypeDown: {
    id: 'dashboard.statusTypeDown',
    defaultMessage: 'Down',
    description: 'text shown for `Down` status'
  },

  dashboardStatusTypeError: {
    id: 'dashboard.statusTypeError',
    defaultMessage: 'Error',
    description: 'text shown for `Error` status'
  },

  dashboardStatusTypeWarning: {
    id: 'dashboard.statusTypeWarning',
    defaultMessage: 'Warning',
    description: 'text shown for `Warning` status'
  },

  dashboardStatusTypeAlert: {
    id: 'dashboard.statusTypeAlert',
    defaultMessage: 'Alert',
    description: 'text shown for `Alert` status'
  },

  dashboardStatusTypeUnknown: {
    id: 'dashboard.statusTypeUnknown',
    defaultMessage: 'Unknown status',
    description: 'text shown for status not recognized by Dashboard'
  },

  dashboardUtilizationCardAvailableOfPercent: {
    id: 'dashboard.utilizationCardAvailableOfPercent',
    defaultMessage: 'of {total, number}%',
    description: 'part of utilization card\'s summary'
  },

  dashboardUtilizationCardAvailableOfUnit: {
    id: 'dashboard.utilizationCardAvailableOfUnit',
    defaultMessage: 'of {total, number} {unit}',
    description: 'part of utilization card\'s summary'
  },

  dashboardUtilizationCardOverCommit: {
    id: 'dashboard.utilizationCardOverCommit',
    defaultMessage: 'Virtual resources - Committed: {overcommit, number}%, Allocated: {allocated, number}%',
    description: 'shown below utilization card\'s summary'
  },

  dashboardUtilizationCardOverCommitTooltip: {
    id: 'dashboard.utilizationCardOverCommitTooltip',
    defaultMessage:
      'The committed and allocated virtual resources are percentages indicating the running virtual resource' +
      ' compared to actual resources.',
    description: 'tooltip for the virtual resource over commit below utilization card\'s summary'
  },

  dashboardUtilizationCardDialogHostListTitle: {
    id: 'dashboard.utilizationCardDialogHostListTitle',
    defaultMessage: 'Hosts ({hostCount, number})',
    description: 'title of `Hosts` list in utilization card\'s dialog'
  },

  dashboardUtilizationCardDialogEmptyHostList: {
    id: 'dashboard.utilizationCardDialogEmptyHostList',
    defaultMessage: 'There are currently no utilized hosts',
    description: 'shown when `Hosts` list in utilization card\'s dialog is empty'
  },

  dashboardUtilizationCardDialogStorageListTitle: {
    id: 'dashboard.utilizationCardDialogStorageListTitle',
    defaultMessage: 'Storage Domains ({storageCount, number})',
    description: 'title of `Storage Domains` list in utilization card\'s dialog'
  },

  dashboardUtilizationCardDialogEmptyStorageList: {
    id: 'dashboard.utilizationCardDialogEmptyStorageList',
    defaultMessage: 'There are currently no utilized storage domains',
    description: 'shown when `Storage Domains` list in utilization card\'s dialog is empty'
  },

  dashboardUtilizationCardDialogVmListTitle: {
    id: 'dashboard.utilizationCardDialogVmListTitle',
    defaultMessage: 'Virtual Machines ({vmCount, number})',
    description: 'title of `Virtual Machines` list in utilization card\'s dialog'
  },

  dashboardUtilizationCardDialogEmptyVmList: {
    id: 'dashboard.utilizationCardDialogEmptyVmList',
    defaultMessage: 'There are currently no utilized virtual machines',
    description: 'shown when `Virtual Machines` list in utilization card\'s dialog is empty'
  },

  dashboardUtilizationCardCpuDialogTitle: {
    id: 'dashboard.utilizationCardCpuDialogTitle',
    defaultMessage: 'Top Utilized Resources (CPU)',
    description: 'title of resource utilization dialog for `CPU` utilization card'
  },

  dashboardUtilizationCardMemoryDialogTitle: {
    id: 'dashboard.utilizationCardMemoryDialogTitle',
    defaultMessage: 'Top Utilized Resources (Memory)',
    description: 'title of resource utilization dialog for `Memory` utilization card'
  },

  dashboardUtilizationCardStorageDialogTitle: {
    id: 'dashboard.utilizationCardStorageDialogTitle',
    defaultMessage: 'Top Utilized Resources (Storage)',
    description: 'title of resource utilization dialog for `Storage` utilization card'
  },

  // modal dialog related strings

  migrateVmDialogTitle: {
    id: 'migrate.vm.dialogTitle',
    defaultMessage: 'Migrate VM(s)',
    description: 'title of VM migrate dialog'
  },

  migrateVmButton: {
    id: 'migrate.vm.buttonLabel',
    defaultMessage: 'Migrate',
    description: 'label of `Migrate` button in VM migrate dialog'
  },

  migrateVmDataError: {
    id: 'migrate.vm.dataError',
    defaultMessage: 'Could not fetch data needed for VM migrate operation',
    description: 'notification shown when VM migrate dialog failed to load its data'
  },

  migrateVmNoAvailableHost: {
    id: 'migrate.vm.noAvailableHost',
    defaultMessage: 'No available host to migrate VMs to',
    description: 'notification shown when there are no hosts the VMs can migrate to'
  },

  migrateVmInfoLabel: {
    id: 'migrate.vm.vmInfoLabel',
    defaultMessage: 'Select a host to migrate {value, number} virtual machine(s) to:',
    description: 'label shown above the target host dropdown, informing the user about VMs that are about to be migrated'
  },

  migrateVmListLabel: {
    id: 'migrate.vm.vmListLabel',
    defaultMessage: 'Virtual Machines',
    description: 'label for the VM list shown below the target host dropdown'
  },

  migrateVmListShowAllLabel: {
    id: 'migrate.vm.vmListShowAllLabel',
    defaultMessage: 'Show all Virtual Machines',
    description: 'text of the link that allows showing all VMs in the VM list'
  },

  migrateVmListShowLessLabel: {
    id: 'migrate.vm.vmListShowLessLabel',
    defaultMessage: 'Show less Virtual Machines',
    description: 'text of the link that allows showing less (up to 10) VMs in the VM list'
  },

  migrateVmSelectHostLabel: {
    id: 'migrate.vm.selectHostLabel',
    defaultMessage: 'Destination Host',
    description: 'label for the dropdown used to select migration target host'
  },

  migrateVmSelectHostFieldHelp: {
    id: 'migrate.vm.selectHostFieldHelp',
    defaultMessage: 'Select \'Automatically Choose Host\' to allow the application to select the best suited Host for these Virtual Machines to migrate to.',
    description: 'field help for the dropdown used to select migration target host'
  },

  migrateVmAutoSelectHost: {
    id: 'migrate.vm.autoSelectHost',
    defaultMessage: 'Automatically Choose Host',
    description: 'label for the default migration target host dropdown option'
  },

  migrateVmAffinityLabel: {
    id: 'migrate.vm.affinityLabel',
    defaultMessage: 'Migrate VMs in Affinity',
    description: 'label for the checkbox used to indicate that all VMs in affinity will be migrated'
  },

  migrateVmAffinityLabelHelp: {
    id: 'migrate.vm.affinityLabelHelp',
    defaultMessage: 'This will migrate also VMs that are not shown in the list below. If the selected VMs are in an affinity together, there may be errors in the log, because it will try to initiate a migration multiple times.',
    description: 'help for the checkbox used to indicate that all VMs in affinity will be migrated'
  },

  migrateVmAffinityCheckbox: {
    id: 'migrate.vm.affinityCheckbox',
    defaultMessage: 'Migrate all VMs in positive enforcing affinity with selected VMs.',
    description: 'checkbox used to indicate that all VMs in affinity will be migrated'
  },

  clusterUpgradeButton: {
    id: 'cluster.upgrade.button',
    defaultMessage: 'Upgrade',
    description: 'label for the cluster upgrade button on webadmin'
  },

  clusterUpgradeClusterInMaintenaceTitle: {
    id: 'cluster.upgrade.ClusterInMaintenaceTitle',
    defaultMessage: 'The cluster is currently in maintenance mode!',
    description: 'cluster upgrade, warn user Cluster is in maintenance mode Confirm Dialog title'
  },

  clusterUpgradeClusterInMaintenaceMessage: {
    id: 'cluster.upgrade.ClusterInMaintenaceMessage',
    defaultMessage:
      'The scheduling policy for cluster {clusterName} is currently set to' +
      ' "cluster_maintenance".  This typically indicates maintenance is currently' +
      ' in progress.  It is not recommeneded to run the cluster upgrade operation' +
      ' in this situation.',
    description: 'cluster upgrade, warn user Cluster is in maintenance mode Confirm Dialog descriptive message'
  },

  clusterUpgradeClusterInMaintenaceContinue: {
    id: 'cluster.upgrade.ClusterInMaintenaceContinue',
    defaultMessage: 'Continue',
    description: 'cluster upgrade, warn user Cluster is in maintenance mode Confirm Dialog button'
  },

  clusterUpgradeTitle: {
    id: 'cluster.upgrade.Title',
    defaultMessage: 'Upgrade Cluster {clusterName}',
    description: 'cluster upgrade Modal Wizard title text'
  },

  clusterUpgradeLoadingTitle: {
    id: 'cluster.upgrade.LoadingTitle',
    defaultMessage: 'Loading Cluster Data...',
    description: 'cluster upgrade Wizard title displayed while initial data is being loaded'
  },

  clusterUpgradeLoadingMessage: {
    id: 'cluster.upgrade.LoadingMessage',
    defaultMessage: 'This may take a few moments.',
    description: 'cluster upgrade Wizard message displayed while initial data is being loaded'
  },

  clusterUpgradeCancelButtonText: {
    id: 'cluster.upgrade.CancelButtonText',
    defaultMessage: 'Cancel',
    description: 'cluster upgrade Wizard Cancel button text'
  },

  clusterUpgradeBackButtonText: {
    id: 'cluster.upgrade.BackButtonText',
    defaultMessage: 'Back',
    description: 'cluster upgrade Wizard Back/Previous step button text'
  },

  clusterUpgradeNextButtonText: {
    id: 'cluster.upgrade.NextButtonText',
    defaultMessage: 'Next',
    description: 'cluster upgrade Wizard Next step button text'
  },

  clusterUpgradeUpgradeButtonText: {
    id: 'cluster.upgrade.UpgradeButtonText',
    defaultMessage: 'Upgrade',
    description: 'cluster upgrade Wizard final step/Upgrade button text'
  },

  clusterUpgradeStepSelectHostsLabel: {
    id: 'cluster.upgrade.StepSelectHostsLabel',
    defaultMessage: 'Select Hosts',
    description: 'cluster upgrade Wizard Step 1 title - Select Hosts'
  },

  clusterUpgradeStepUpgradeOptionsLabel: {
    id: 'cluster.upgrade.StepUpgradeOptionsLabel',
    defaultMessage: 'Upgrade Options',
    description: 'cluster upgrade Wizard Step 2 title - Upgrade Options'
  },

  clusterUpgradeStepReviewLabel: {
    id: 'cluster.upgrade.StepReviewLabel',
    defaultMessage: 'Cluster Upgrade Review',
    description: 'cluster upgrade Wizard Step 3 title - Upgrade Review'
  },

  clusterUpgradeNoHostsMessage: {
    id: 'cluster.upgrade.NoHostsMessage',
    defaultMessage: 'There are no hosts in this cluster.  A cluster without hosts cannot be upgraded.',
    description: 'cluster upgrade Wizard error message when a cluster has no hosts to upgrade'
  },

  clusterUpgradeSelectHostsMessage: {
    id: 'cluster.upgrade.SelectHostsMessage',
    defaultMessage: 'If a host has a down status, it can cause the cluster upgrade to fail.',
    description: 'cluster upgrade Wizard Step 1 - info message above the host selection table'
  },

  clusterUpgradeHostTableHeaderStatus: {
    id: 'cluster.upgrade.HostTableHeaderStatus',
    defaultMessage: 'Status',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, Status column header'
  },

  clusterUpgradeHostTableHeaderName: {
    id: 'cluster.upgrade.HostTableHeaderName',
    defaultMessage: 'Name',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, Name column header'
  },

  clusterUpgradeHostTableHeaderHostname: {
    id: 'cluster.upgrade.HostTableHeaderHostname',
    defaultMessage: 'Hostname/IP Address',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, Hostname column header'
  },

  clusterUpgradeHostTableHeaderVMs: {
    id: 'cluster.upgrade.HostTableHeaderVMs',
    defaultMessage: 'Virtual Machines',
    description: 'cluster upgrade Wizard Step 1 - Host Selection Table, VM count column header'
  },

  clusterUpgradeStopPinnedLabel: {
    id: 'cluster.upgrade.StopPinnedLabel',
    defaultMessage: 'Stop Pinned VMs',
    description: 'cluster upgrade Wizard Step 2 - stop pinned vms field label'
  },

  clusterUpgradeStopPinnedFieldHelp: {
    id: 'cluster.upgrade.StopPinnedFieldHelp',
    defaultMessage:
      'Specify whether to stop virtual machines pinned to the host being' +
      ' upgraded. If checked, the pinned non-migratable virtual machines will' +
      ' be stopped and host will be upgraded, otherwise the host will be skipped.',
    description: 'cluster upgrade Wizard Step 2 - stop pinned vms field help'
  },

  clusterUpgradeStopPinnedDescription: {
    id: 'cluster.upgrade.StopPinnedDescription',
    defaultMessage: 'Stop Virtual Machines pinned to Hosts',
    description: 'cluster upgrade Wizard Step 2 - stop pinned vms field checkbox description'
  },

  clusterUpgradeUpgradeTimeoutLabel: {
    id: 'cluster.upgrade.UpgradeTimeoutLabel',
    defaultMessage: 'Upgrade Timeout (Minutes)',
    description: 'cluster upgrade Wizard Step 2 - upgrade timeout field label'
  },

  clusterUpgradeUpgradeTimeoutFieldHelp: {
    id: 'cluster.upgrade.UpgradeTimeoutFieldHelp',
    defaultMessage:
      'Timeout in minutes to wait for an individual host to be upgraded.' +
      ' The default is 60 minutes (1 hour).',
    description: 'cluster upgrade Wizard Step 2 - upgrade timeout field help'
  },

  clusterUpgradeCheckUpgradeLabel: {
    id: 'cluster.upgrade.CheckUpgradeLabel',
    defaultMessage: 'Check Upgrade',
    description: 'cluster upgrade Wizard Step 2 - check upgrade field label'
  },

  clusterUpgradeCheckUpgradeFieldHelp: {
    id: 'cluster.upgrade.CheckUpgradeFieldHelp',
    defaultMessage:
      'If checked, run check_for_upgrade action on all hosts before executing' +
      ' upgrade on them. If unchecked, run upgrade only for hosts with available' +
      ' upgrades and ignore all other hosts.',
    description: 'cluster upgrade Wizard Step 2 - check upgrade field help'
  },

  clusterUpgradeCheckUpgradeDescription: {
    id: 'cluster.upgrade.CheckUpgradeDescription',
    defaultMessage: 'Check for upgrades on all Hosts (If not, only upgrade Hosts with known upgrades)',
    description: 'cluster upgrade Wizard Step 2 - check upgrade field checkbox description'
  },

  clusterUpgradeRebootAfterLabel: {
    id: 'cluster.upgrade.RebootAfterLabel',
    defaultMessage: 'Reboot After Upgrade',
    description: 'cluster upgrade Wizard Step 2 - reboot host after upgrade field label'
  },

  clusterUpgradeRebootAfterFieldHelp: {
    id: 'cluster.upgrade.RebootAfterFieldHelp',
    defaultMessage: 'If checked reboot hosts after successful upgrade.',
    description: 'cluster upgrade Wizard Step 2 - reboot host after upgrade field help'
  },

  clusterUpgradeRebootAfterDescription: {
    id: 'cluster.upgrade.RebootAfterDescription',
    defaultMessage: 'Reboot Hosts after upgrade',
    description: 'cluster upgrade Wizard Step 2 - reboot host after upgrade field checkbox description'
  },

  clusterUpgradeUseMaintenancePolicyLabel: {
    id: 'cluster.upgrade.UseMaintenancePolicyLabel',
    defaultMessage: 'Use Maintenance Policy',
    description: 'cluster upgrade Wizard Step 2 - use maintenance policy field label'
  },

  clusterUpgradeUseMaintenancePolicyFieldHelp: {
    id: 'cluster.upgrade.UseMaintenancePolicyFieldHelp',
    defaultMessage:
      'If checked the cluster\'s policy will be switched to "maintenance" during' +
      ' the upgrade. If not checked the policy will be unchanged.',
    description: 'cluster upgrade Wizard Step 2 - use maintenance policy field help'
  },

  clusterUpgradeUseMaintenancePolicyDescription: {
    id: 'cluster.upgrade.UseMaintenancePolicyDescription',
    defaultMessage: 'Switch Cluster policy to Cluster Maintenance during upgrade',
    description: 'cluster upgrade Wizard Step 2 - use maintenance policy field checkbox description'
  },

  clusterUpgradeHostsLabel: {
    id: 'cluster.upgrade.HostsLabel',
    defaultMessage: '{count,number} {count, plural, one {Host} other {Hosts}}',
    description: 'cluster upgrade Wizard Step 3 - host count title (ICU formatted message)'
  },

  clusterUpgradeHostsDescription: {
    id: 'cluster.upgrade.HostsDescription',
    defaultMessage: 'Will be upgraded one at a time during Cluster upgrade',
    description: 'cluster upgrade Wizard Step 3 - host count description'
  },

  clusterUpgradeNonMigratableLabel: {
    id: 'cluster.upgrade.NonMigratableLabel',
    defaultMessage: '{count,number} Pinned VMs',
    description: 'cluster upgrade Wizard Step 3 - pinned VM (non-migratable VM) count title (ICU formatted message)'
  },

  clusterUpgradeNonMigratableDescription: {
    id: 'cluster.upgrade.NonMigratableDescription',
    defaultMessage: 'Will be stopped before Cluster upgrade',
    description: 'cluster upgrade Wizard Step 3 - pinned VM (non-migratable VM) count description'
  },

  clusterUpgradeMigrateLabel: {
    id: 'cluster.upgrade.MigrateLabel',
    defaultMessage: '{count,number} VMs',
    description: 'cluster upgrade Wizard Step 3 - count of VMs to be migrated during upgrade title (ICU formatted message)'
  },

  clusterUpgradeMigrateDescription: {
    id: 'cluster.upgrade.MigrateDescription',
    defaultMessage: 'Will be migrated to a new Host before Cluster upgrade',
    description: 'cluster upgrade Wizard Step 3 - count of VMs to be migrated during upgrade description'
  },

  clusterUpgradeOperationStarted: {
    id: 'cluster.upgrade.OperationStarted',
    defaultMessage: 'Upgrade has started for {clusterName}.',
    description: 'cluster upgrade operation started toast notification text'
  },

  clusterUpgradeOperationFailed: {
    id: 'cluster.upgrade.OperationFailed',
    defaultMessage: 'Failed to start the upgrade for {clusterName}.',
    description: 'cluster upgrade operation failed toast notification text'
  },

  vprotectBackupTaskSuccess: {
    id: 'vprotect.vprotectBackupTaskSuccess',
    defaultMessage: 'Backup task has been submitted',
    description: 'notification shown when Backup task has been submitted'
  },

  vprotectRestoreTaskSuccess: {
    id: 'vprotect.vprotectRestoreTaskSuccess',
    defaultMessage: 'Restore task has been submitted',
    description: 'notification shown when Restore task has been submitted'
  }

}

module.exports = exports = messageDescriptors
