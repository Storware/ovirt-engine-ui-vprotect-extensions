import { MILLISECONDS_IN_DAY } from 'utils/milisecondsTimespan';

export class Range {
  from = new Date().getTime() - MILLISECONDS_IN_DAY;
  to = new Date().getTime();
}
