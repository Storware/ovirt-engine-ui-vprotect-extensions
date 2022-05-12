import { NetworkAction, SET_NETWORK, SET_NETWORK_COPY } from './types';
import { Dispatch } from 'redux';
import { networkService } from '../../services/network-service';

export const setNetworkAction = (payload: any): NetworkAction => {
  return {
    type: SET_NETWORK,
    payload,
  };
};

export const getNetwork = (params) => async (dispatch: Dispatch) => {
  const network = await networkService.getNetworkList(params);
  await dispatch(setNetworkAction(network));
};
