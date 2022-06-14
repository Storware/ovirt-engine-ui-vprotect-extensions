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
    void networkService
      .getNetworkList({
        ...(hypervisorManagerGuid && {
          'hypervisor-manager': hypervisorManagerGuid,
        }),
      })
      .then((network) => dispatch(setNetworkAction(network)));
  };
