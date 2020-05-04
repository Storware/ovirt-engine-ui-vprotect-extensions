import getPluginApi from '../../../plugin-api'
import {alertService} from './alert-service'

const vprotectURL = getPluginApi().configObject().vProtectURL

class VprotectApiService {
  get (url, options = {}) {
    return fetch(vprotectURL + url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    })
      .then(response => {
        if (!response.ok) {
          alertService.error(response.statusText)
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
          alertService.error(response.statusText)
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
          alertService.error(response.statusText)
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
          alertService.error(response.statusText)
          return Promise.reject(response)
        }
        return Promise.resolve()
      })
  }
}

export const vprotectApiService = new VprotectApiService()
