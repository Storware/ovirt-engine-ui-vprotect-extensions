import { NameAndGuid } from '../dto/nameAndGuid';
import { NetworkInterfaceCard } from './network-interface-card';

export class RestoredNetwork {
  network: NameAndGuid;
  networkInterfaceCard: NameAndGuid;

  constructor(networkInterfaceCards: NetworkInterfaceCard) {
    this.network = {
      name: networkInterfaceCards.network.name,
      guid: networkInterfaceCards.network.guid,
    };
    this.networkInterfaceCard = {
      name: networkInterfaceCards.name,
      guid: networkInterfaceCards.guid,
    };
  }
}
