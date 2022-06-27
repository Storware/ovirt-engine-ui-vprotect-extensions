import { NameAndGuid } from 'model/dto/nameAndGuid';

export class MailingListModel {
  guid: string;
  name: string;
  recipients: string[] = [];
  project: NameAndGuid;
}
