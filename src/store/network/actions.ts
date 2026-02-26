import { NetworkAction, SET_NETWORK, SET_NETWORK_COPY } from './types';
import { Dispatch } from 'redux';
import { networkService } from '../../services/network-service';

export const setNetworkAction = (payload: any): NetworkAction => ({
  type: SET_NETWORK,
  payload,
});

export const getNetwork =
  ({ hypervisorManagerGuid }) =>
  (dispatch: Dispatch) => {
    const privateNetworksRequest = networkService.getNetworkList({
      ...(hypervisorManagerGuid && {
        'hypervisor-manager': hypervisorManagerGuid,
      }),
    });
    const sharedNetworksRequest = networkService.getNetworkSharedList({
      ...(hypervisorManagerGuid && {
        'hypervisor-manager': hypervisorManagerGuid,
      }),
    });

    Promise.all([privateNetworksRequest, sharedNetworksRequest]).then(
      ([privateNetworks, sharedNetworks]) => {
        const combined = [
          ...(privateNetworks ?? []),
          ...(sharedNetworks?.map((network) => {
            network.name = network.name + ' (shared)';
            return network;
          }) ?? []),
        ];
        dispatch(setNetworkAction(combined));
      },
    );
  };
