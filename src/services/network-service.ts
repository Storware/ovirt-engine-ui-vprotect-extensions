import { vprotectApiService } from './vprotect-api-service';

class NetworkService {
  getNetworkList(params?) {
    return vprotectApiService.get('/network', { params });
  }
  getNetworkSharedList(params?) {
    return vprotectApiService.get('/network/shared', { params });
  }
}

export const networkService = new NetworkService();
