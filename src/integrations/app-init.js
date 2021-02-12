import getPluginApi from 'integrations/plugin-api';
import { updateConfig } from 'integrations/plugin-config';

// update the app configuration based on the plugin config
const updateFromPluginConfig = (resolve, reject) => {
  if (__DEV__)
    console.log('pluginApi.configObject:', getPluginApi.configObject());
  let { useFakeData, clusterUpgradePlaybook } =
    getPluginApi.configObject() || {};

  try {
    useFakeData =
      typeof useFakeData === 'string'
        ? /^(true|t|yes|y)$/i.test(useFakeData)
        : Boolean(useFakeData);
  } catch (e) {
    reject('Failed to access or interpret [useFakeData] from PluginAPI config');
  }

  try {
    clusterUpgradePlaybook = /^[a-zA-Z](\w|-)*\w$/.test
      ? clusterUpgradePlaybook
      : undefined;
  } catch (e) {
    reject(
      'Failed to access or interpret [clusterUpgradePlaybook] from PluginAPI config',
    );
  }

  updateConfig({
    useFakeData,
    clusterUpgradePlaybook,
  });
  resolve();
};

export default {
  run() {
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise(updateFromPluginConfig),
      ])
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(`Application init failed: ${error}`);
          reject(error);
        });
    });
  },
};
