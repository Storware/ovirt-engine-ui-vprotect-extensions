import { AdvancedDateAndTime } from '../AdvancedDateAndTime';

export class Range {
  from = new Date().getTime() - AdvancedDateAndTime.MILLISECONDS_IN_DAY;
  to = new Date().getTime();
}
