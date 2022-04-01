import fetch from 'node-fetch';

/*
 * Visit this URL to get access token
 * https://github.com/settings/tokens
 *
 * More info you can find here:
 * https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
 * */

export class ApiService {
  private readonly _urlBase: string;

  constructor(urlBase: string) {
    this._urlBase = urlBase;
  }

  async request(method, path, body, options) {
    let fullPath = this._urlBase + path;
    if (options && options.params) {
      fullPath += `?${new URLSearchParams(options.params)}`;
    }

    console.log({
      method,
      fullPath,
      options,
    });
    return await fetch(fullPath, {
      method,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token TOKEN`,
        'Content-Type': 'application/zip',
      },
      ...options,
      ...(body && { body: JSON.stringify(body) }),
    }).then(async (response) => {
      console.log(response);
      if (!response.ok) {
        const json = await response.json();
        return Promise.reject(json);
      }

      if (options && options.responseType === 'blob') {
        return response;
      }
      if (response.statusText !== 'No Content') {
        return await response.json();
      }
    });
  }

  get(path, options = {}) {
    return this.request('GET', path, {}, options);
  }

  post(path, body, options = {}) {
    return this.request('POST', path, body, options);
  }

  put(path, body, options = {}) {
    return this.request('PUT', path, body, options);
  }

  delete(path, options = {}) {
    return this.request('DELETE', path, {}, options);
  }
}
