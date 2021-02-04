import getPluginApi from 'integrations/plugin-api';
import { alertService } from './alert-service';
import { fetchUrl } from '../utils/fetchUrl';

const errorMessage = (error) => {
  if (error && error.error && error.error.message) {
    return error.error.message;
  } else if (error && error.message) {
    return error.message;
  } else {
    return 'Something went wrong';
  }
};

class VprotectApiService {
  vprotectURL;

  async request(method, path, body, options) {
    if (!this.vprotectURL) {
      const config = await getPluginApi.configObject();
      this.vprotectURL = config.vProtectURL;
    }
    return fetch(fetchUrl(this.vprotectURL, path), {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      ...(['POST', 'PUT'].includes(method)
        ? { body: JSON.stringify(body) }
        : {}),
    }).then((response) => {
      if (!response.ok) {
        alertService.error(errorMessage(response));
        return Promise.reject(response);
      }
      return response.json();
    });
  }

  get(path, options = {}) {
    return this.request('GET', path, {}, options);
  }

  post(path, body, options) {
    return this.request('POST', path, body, options);
  }

  put(path, body, options) {
    return this.request('PUT', path, body, options);
  }

  delete(path, options = {}) {
    return this.request('DELETE', path, {}, options);
  }
}

export const vprotectApiService = new VprotectApiService();
