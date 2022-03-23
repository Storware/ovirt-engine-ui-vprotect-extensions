import { NetworkAction, SET_NETWORK, SET_NETWORK_COPY } from './types';
import { Dispatch } from 'redux';
import { networkService } from '../../services/network-service';

export const setNetworkAction = (payload: any): NetworkAction => {
  return {
    type: SET_NETWORK,
    payload,
  };
};

export const setNetworkCopyAction = (payload: any): NetworkAction => {
  return {
    type: SET_NETWORK_COPY,
    payload,
  };
};

export const getNetwork =
  ({ hypervisorManagerGuid }) =>
  async (dispatch: Dispatch) => {
    const network = await networkService.getNetworkList({
      ...(hypervisorManagerGuid && {
        'hypervisor-manager': hypervisorManagerGuid,
      }),
    });
    await dispatch(setNetworkAction(network));
    await dispatch(setNetworkCopyAction(network));
  };
