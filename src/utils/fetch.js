import getPluginApi from '../plugin-api'

function withTrailingSlash (path) {
  return path.endsWith('/') ? path : path + '/'
}

function withoutLeadingSlash (path) {
  return path.startsWith('/') ? path.slice(1) : path
}

function engineUrl (relativePath) {
  return withTrailingSlash(getPluginApi().engineBaseUrl()) + withoutLeadingSlash(relativePath)
}

function engineRequestHeaders (extraHeaders = {}) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getPluginApi().ssoToken()}`,
    ...extraHeaders
  }
}

/**
 * Initiate Engine HTTP `GET` request, expecting JSON response.
 *
 * @example
 * ```
 * const json = await engineGet(`api/vms/${vmId}`)
 * ```
 */
export async function engineGet (relativePath, extraHeaders) {
  const response = await fetch(engineUrl(relativePath), {
    method: 'GET',
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin'
  })
  return response.json()
}

/**
 * Initiate Engine HTTP `POST` request, expecting JSON response.
 *
 * @example
 * ```
 * const body = JSON.stringify({ host: { id: targetHostId } })
 * const json = await enginePost(`api/vms/${vmId}/migrate`, body)
 * ```
 */
export async function enginePost (relativePath, body, extraHeaders) {
  const response = await fetch(engineUrl(relativePath), {
    method: 'POST',
    headers: engineRequestHeaders(extraHeaders),
    credentials: 'same-origin',
    body
  })
  return response.json()
}

/**
 * Initiate Engine HTTP `POST` to the async ansible playbook execution service.
 *
 * @example
 * ```
 * ```
 *
 * @param {string} playbook The name of the ovirt playbook to execute
 * @param {string} variables Set of variables passed to the playbook
 */
export async function ansiblePlaybookPost (playbook, variables = '', executionTimeoutInMin = 0) {
  if (typeof playbook !== 'string' || !/[a-z]((-[a-z])*[a-z])?/.test(playbook)) {
    throw new Error(`Invalid playbook name: ${playbook}`)
  }
  const executionTimeoutParameter = executionTimeoutInMin > 0 ? `&execution_timeout=${executionTimeoutInMin}` : ''
  const response = await fetch(engineUrl(`services/ansible?playbook=${playbook}${executionTimeoutParameter}`), {
    method: 'POST',
    headers: engineRequestHeaders({
      'Content-Type': 'text/plain'
    }),
    credentials: 'same-origin',
    body: variables
  })

  if (response.status !== 200) {
    return Promise.reject(new Error(`Problem running ansible playbook "${playbook}". Error: ${response.status}`))
  }

  return response.text()
}
