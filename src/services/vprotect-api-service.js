import getPluginApi from 'integrations/plugin-api';
import { alertService } from './alert-service';
import { getCsrfTokenHeader } from '../utils/getCsrfTokenHeader';

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
    return fetch(this.vprotectURL + path, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfTokenHeader(),
      },
      ...options,
      ...(['POST', 'PUT'].includes(method)
        ? { body: JSON.stringify(body) }
        : {}),
    }).then(async (response) => {
      const jsonResponse = await response.json();
      if (!response.ok) {
        alertService.error(errorMessage(jsonResponse));
        return Promise.reject(jsonResponse);
      }
      return jsonResponse;
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
