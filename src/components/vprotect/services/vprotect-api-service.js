import getPluginApi from '../../../plugin-api'
import {alertService} from './alert-service'

// const vprotectURL = getPluginApi().configObject().vProtectURL
const vprotectURL = 'https://10.40.0.55:8181/api'

const errorMessage = (error) => {
  if (error && error.error && error.error.message) {
    return error.error.message
  } else if (error && error.message) {
    return error.message
  } else {
    return 'Something went wrong'
  }
}

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
          alertService.error(errorMessage(response))
          return Promise.reject(response)
        }
        return response.json()
      })
  }

  post (url, body, options) {
    return fetch(vprotectURL + url, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options,
      body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) {
          alertService.error(errorMessage(response))
          return Promise.reject(response)
        }
        return options && options.observe ? response : response.json()
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
          alertService.error(errorMessage(response))
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
          alertService.error(errorMessage(response))
          return Promise.reject(response)
        }
        return Promise.resolve()
      })
  }
}

export const vprotectApiService = new VprotectApiService()
