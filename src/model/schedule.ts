import { NameAndGuid } from './dto/nameAndGuid';
import { NameAndDescription } from './dto/nameAndDescription';
import { Interval } from './Interval';

const types = [
  { name: 'VM_BACKUP', description: 'veBackup' },
  { name: 'VM_SNAPSHOT', description: 'snapshotManagement' },
];

export class Schedule {
  guid: string;
  name = '';
  hour = 0;
  active = true;
  backupType: NameAndDescription<string> = { name: 'FULL', description: 'Full' };
  daysOfWeek: any[] = [];
  months: any[] = [];
  rules: any[] = [];
  dayOfWeekOccurrences: any[] = [];
  policies: NameAndGuid[];
  startWindowLength: number = 360 * 1000 * 60;
  type: NameAndDescription<string>;
  executionType: NameAndDescription<string> = { name: 'TIME', description: 'Time' };
  interval: Interval = null;

  constructor(type: string) {
    this.type = types.find((el) => type === el.name);
  }
}
