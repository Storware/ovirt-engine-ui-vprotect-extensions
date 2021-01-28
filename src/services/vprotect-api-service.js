import getPluginApi from 'integrations/plugin-api';
import { alertService } from './alert-service';

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
  config;
  vprotectURL;

  async request(method, url, body, options) {
    if(!this.config) {
      this.config = await getPluginApi.configObject();
      this.vprotectURL = this.config.vProtectURL;
    }
    return fetch(this.vprotectURL + url, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
      ...(["POST", "PUT"].includes(method) ? {body: JSON.stringify(body)} : {})
    }).then((response) => {
      if (!response.ok) {
        alertService.error(errorMessage(response));
        return Promise.reject(response);
      }
      return response.json();
    });
  }

    get(url, options = {}) {
        return this.request("GET", url, {}, options)
    }

    post(url, body, options) {
        return this.request("POST", url, body, options)
    }

    put(url, body, options) {
        return this.request("PUT", url, body, options)
    }

    delete(url, options = {}) {
        return this.request("DELETE", url, {}, options)
    }
}

export const vprotectApiService = new VprotectApiService();
