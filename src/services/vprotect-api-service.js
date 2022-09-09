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
const addParameters = (url = '', parameters = {}) => {
  const params = new URLSearchParams(new URL(url));

  Object.keys(parameters).forEach((paramName) => {
    if (Array.isArray(parameters[paramName])) {
      parameters[paramName].forEach((arrValues) =>
        params.append(paramName, arrValues),
      );
      return;
    }
    params.append(paramName, parameters[paramName]);
  });

  return `${url}?${params}`;
};

class VprotectApiService {
  vprotectURL;

  async request(method, path, body, options) {
    if (!this.vprotectURL) {
      const config = await getPluginApi.configObject();
      this.vprotectURL = config.vProtectURL;
    }
    let fullPath = this.vprotectURL + path;
    if (options?.params) {
      fullPath = addParameters(fullPath, options.params);
    }

    return fetch(fullPath, {
      method,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfTokenHeader(),
        ...options?.headers,
      },
      ...options,
      ...(['POST', 'PUT'].includes(method)
        ? { body: JSON.stringify(body) }
        : {}),
    }).then(async (response) => {
      if (!response.ok) {
        const json = await response.json();
        alertService.error(errorMessage(json));
        return Promise.reject(json);
      }

      if (options && options.responseType === 'blob') {
        return response;
      }
      if (response.statusText !== 'No Content') {
        const r = await response.text();
        if (r !== '') {
          const json = JSON.parse(r);
          if (options?.paginate) {
            const totalCountHeader = response.headers.get('X-Total-Count');
            return { body: json, totalCount: totalCountHeader };
          }
          return json;
        }
      }
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
