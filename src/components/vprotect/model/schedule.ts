import { NameAndGuid } from './dto/nameAndGuid';
import { NameAndDescription } from './dto/nameAndDescription';
import {Interval} from './interval';

export class Schedule {
  guid: string;
  name: string;
  hour = 0;
  active = true;
  backupType: NameAndDescription;
  daysOfWeek: any[] = [];
  months: any[] = [];
  rules: any[] = [];
  dayOfWeekOccurrences: any[] = [];
  policies: NameAndGuid[];
  startWindowLength: number = 360 * 1000 * 60;
  type: NameAndDescription;
  executionType: NameAndDescription;
  interval: Interval = null;
}
