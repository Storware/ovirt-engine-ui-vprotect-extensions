import { NameAndGuid } from 'model/dto/nameAndGuid';

export interface NetworkInterfaceCard {
  guid: string;
  uuid: string;
  name: string;
  network: NameAndGuid;
  virtualMachine: NameAndGuid;
  backups: NameAndGuid[];
}
