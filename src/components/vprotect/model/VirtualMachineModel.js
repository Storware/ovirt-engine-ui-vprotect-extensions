export class VirtualMachineModel {
  guid
  name
  hypervisor
  hvManager
  vmBackupPolicy
  snapshotMgmtPolicy
  hvType
  hvmType
  backupUpToDate
  backups
  lastBackup
  lastSuccessfulBackupSize
  lastSuccessfulFullBackupSize
  present
  tags
  tasks
  uuid
  vmExportImportMode
  lastStoredSnapshot
  quiesceBeforeSnapshot
  sshHost
  sshPort
  sshUser
  sshKeyPath
  postSnapCmdArgs
  postSnapCmdExecEnabled
  preSnapCmdArgs
  preSnapCmdExecEnabled
  warningsPresent
  restoreStatus
  // ui
  checked
  backupStatus
  restoreStat
  baseImageCreationConfig
  preSnapIgnoredExitCodes
  postSnapIgnoredExitCodes
  preSnapStdErrorHandling
  postSnapStdErrorHandling
}

// export var preAndPostSnapStdErrorHandlingOptions = [
//   {name: 'DONT_IGNORE', description: `Don't ignore`},
//   {name: 'IGNORE_WITHOUT_WARNING', description: 'Ignore without warning'},
//   {name: 'IGNORE_WITH_WARNING', description: 'Ignore with warning'}
// ]
