export class BackupTask {
  backupType = null;
  backupDestination = null;
  protectedEntities = null;
  priority = 50;
  windowStart = new Date().getTime();
  retryCount = 0;
  rules = [];
}
