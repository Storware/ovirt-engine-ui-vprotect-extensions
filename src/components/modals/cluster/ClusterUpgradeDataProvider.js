import React from 'react'
import PropTypes from 'prop-types'
import getPluginApi from '../../../plugin-api'
import DataProvider from '../../helper/DataProvider'
import config from '../../../plugin-config'

import { webadminToastTypes } from '../../../constants'
import { engineGet, ansiblePlaybookPost } from '../../../utils/fetch'
import { msg } from '../../../intl-messages'

//
// for FAKE_DATA=true
//
const fakeHost = (clusterId, hostName, status, updateAvailable, active) => ({
  id: `1111-${hostName}-2222`,
  name: hostName,
  cluster: { id: clusterId },
  address: `${hostName}.ovirt`,
  status,
  summary: { active, migrating: '0', total: active },
  update_available: updateAvailable
})

const randomHosts = (clusterId, count) => {
  const hosts = []
  for (let i = 0; i < count; i++) {
    hosts[i] = fakeHost(
      clusterId,
      `hostR${i}`,
      Math.round(Math.random() * 10 % 1) ? 'up' : 'down',
      Math.round(Math.random() * 10 % 1) ? 'true' : 'false',
      Math.round(Math.random() * 100 % 25)
    )
  }
  return hosts
}

const fakeHosts = (clusterId) => Promise.resolve([
  fakeHost(clusterId, 'host1', 'up', 'true', '4'),
  fakeHost(clusterId, 'host2', 'up', 'true', '12'),
  fakeHost(clusterId, 'host3', 'down', 'true', '0'),
  fakeHost(clusterId, 'host4', 'up', 'true', '7'),
  fakeHost(clusterId, 'host5', 'down', 'false', '0'),
  ...randomHosts(clusterId, 2 + (Math.random() * 100 % 20))
])
//
//

/**
 * Fetch the selected Engine clusters.
 */
async function fetchCluster (id) {
  const json = await engineGet(`api/clusters/${id}?follow=scheduling_policy`)

  if (json.error || !json.id || json.id !== id) {
    throw new Error(`ClusterUpgradeDataProvider: Failed to fetch cluster ${id}`)
  }

  return json
}

/**
 * Fetch the Hosts attached to a given Engine cluster.
 */
async function fetchClusterHosts (clusterId, clusterName) {
  const search = `cluster="${clusterName}"`
  const json = await engineGet(`api/hosts?search=${encodeURIComponent(search)}`)

  if (json.error) {
    throw new Error(`ClusterUpgradeDataProvider: Failed to fetch cluster hosts: ${json.error}`)
  }

  if (!json.host) {
    return []
  }

  return json.host
}

const sleep = (ms) => {
  console.log(`sleeping for ${ms}ms`)
  return new Promise(resolve => setTimeout(() => {
    console.log(`sleeping complete!`)
    resolve()
  }, ms))
}

/**
 * Fetch all data needed by `ClusterUpgradeModal`.
 */
async function fetchData ({ id: clusterId, name: clusterName }) {
  const [
    cluster,
    hosts
  ] = await Promise.all([
    fetchCluster(clusterId),
    config.useFakeData ? fakeHosts(clusterId) : fetchClusterHosts(clusterId, clusterName),
    config.useFakeData ? sleep(5000) : true
  ])

  return { cluster, hosts }
}

/**
 * If an ansbile execution timeout is not provided by the Wizard, default to 1 day.
 */
const DEFAULT_EXECUTION_TIMEOUT_IN_MIN = 1440

/**
 * Upgrade the given cluster.
 *
 * Errors in forming or calling the upgrade operation are currently handled here.
 */
async function upgradeCluster ({
  clusterName,
  executionTimeoutInMin = DEFAULT_EXECUTION_TIMEOUT_IN_MIN,
  ...rest
}) {
  const ansiblePayload = { clusterName, ...rest }

  // https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#passing-variables-on-the-command-line
  const ansibleVariables = JSON.stringify({
    cluster_name: ansiblePayload.clusterName,
    stop_non_migratable_vms: ansiblePayload.stopPinnedVms,
    upgrade_timeout: ansiblePayload.upgradeTimeoutInMin * 60,
    host_names: ansiblePayload.hostNames,
    check_upgrade: ansiblePayload.checkForUpgradesOnHosts,
    reboot_after_upgrade: ansiblePayload.rebootAfterUpgrade,
    use_maintenance_policy: ansiblePayload.useMaintenanceClusterPolicy
  })
  const playbookName = config.clusterUpgradePlaybook

  if (config.useFakeData) {
    getPluginApi().showToast(
      webadminToastTypes.info,
      `Upgrade using fake data, nothing to upgrade for ${clusterName}.`
    )
    console.info('**upgradeCluster**\nplaybook: "%s",\nansibleVariables:---\n%s\n---',
      playbookName, ansibleVariables)
    return
  }

  try {
    await ansiblePlaybookPost(playbookName, ansibleVariables, executionTimeoutInMin)
    getPluginApi().showToast(
      webadminToastTypes.info,
      msg.clusterUpgradeOperationStarted({ clusterName })
    )
  } catch (error) {
    console.error(
      'upgradeCluster: the ansible service failed\n\nplaybook: %s\nansibleVariables:\n%s',
      playbookName,
      ansibleVariables)
    getPluginApi().showToast(
      webadminToastTypes.danger,
      msg.clusterUpgradeOperationFailed({ clusterName })
    )
  }
}

/**
 * Using `DataProvider` and `fetchData`, fetch any data necessary to start a cluster
 * upgrade wizard operation. The `DataProvider` will change props as the fetch goes
 * through inProgress, potentially an error, and then the resulting JSON data. The child
 * component is re-rendered at each step.
 *
 * The callback function `upgradeCluster` is provided to the child component to allow
 * execution of the cluster upgrade operation.
 */
const ClusterUpgradeDataProvider = ({ children, cluster }) => (
  <DataProvider fetchData={() => fetchData(cluster)}>

    {({ data, fetchError, fetchInProgress }) => {
      // expecting single child component
      const child = React.Children.only(children)

      // handle data loading and error scenarios
      if (fetchError) {
        getPluginApi().showToast(webadminToastTypes.danger, msg.clusterUpgradeDataError())
        return React.cloneElement(child, { show: false })
      }
      if (fetchInProgress || !data) {
        return React.cloneElement(child, { isLoading: true })
      }

      // prep data for the child
      const { cluster, hosts } = data

      // pass relevant data and operations to child ClusterUpgradeModal component
      return React.cloneElement(child, {
        cluster,
        clusterHosts: hosts,

        upgradeCluster: (upgradePayload) => upgradeCluster(upgradePayload)
      })
    }}

  </DataProvider>
)

ClusterUpgradeDataProvider.propTypes = {
  children: PropTypes.element.isRequired,
  cluster: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }).isRequired
}

export default ClusterUpgradeDataProvider
