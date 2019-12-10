import getPluginApi from '../plugin-api'
import {AlertService} from './alert-service'

const vprotectURL = getPluginApi().configObject().vProtectURL

export class VprotectApiService {
  alertService = new AlertService();

  get (url) {
    return fetch(vprotectURL + url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          this.alertService.error(response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  post (url, body) {
    return fetch(vprotectURL + url, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) {
          this.alertService.error(response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  put (url, body) {
    return fetch(vprotectURL + url, {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) {
          this.alertService.error(response.statusText)
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  delete (url) {
    return fetch(vprotectURL + url, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          this.alertService.error(response.statusText)
          return Promise.reject(response)
        }
        return Promise.resolve()
      })
  }
}
