import { Summary } from './summary';

export class Report {
  backups = new Summary();
  restores = new Summary();
}
