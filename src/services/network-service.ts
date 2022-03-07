import { vprotectApiService } from './vprotect-api-service';

class NetworkService {
  getNetworkList(params?) {
    return vprotectApiService.get('/network', { params });
  }
}

export const networkService = new NetworkService();
