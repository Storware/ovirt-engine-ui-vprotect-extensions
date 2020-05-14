import {schedulesService} from '../services/schedules-service'

export class VirtualMachineSchedule {
  guid;
  name = '';
  hour = 36000000;
  active = true;
  backupType = schedulesService.backupTypes[0];
  executionType = schedulesService.executionTypes[0];
  daysOfWeek = [];
  months = [];
  rules = [];
  dayOfWeekOccurrences = [];
  policies;
  startWindowLength = 21600000;
  type = {name: 'VM_BACKUP', description: 'veBackup'};
  interval = null;
}
