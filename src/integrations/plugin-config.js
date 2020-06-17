//
// Module scoped variables with config default values. Change values with `updateConfig`.
//
let useFakeData = false;
let clusterUpgradePlaybook = 'ovirt-cluster-upgrade';

//
// Defining the properties against the `pluginConfigs` object allows the client code to
// access the values as read-only properties instead of relying on function call or
// Object/hash/Map keys.  The object values are defined here so the JSDoc gets attached
// properly and is available in code assist/intellisense.
//
/**
 * Plugin Configuration
 *
 * Values may be set by adding a `ui-extensions-config.json` file in the ovirt
 * `ui-plugins` config folder.
 */
const pluginConfigs = {
  /**
   * This flag is a hint to components that normally work with remote
   * data. If set to true, such components should use fake data instead
   * of communicating with remote endpoint(s).
   *
   * @readonly
   */
  useFakeData,

  /**
   * Define the name of the ansible playbook the cluster upgrade wizard
   * will invoke upon confirmation of the action.
   *
   * @readonly
   */
  clusterUpgradePlaybook,
};

Object.defineProperties(pluginConfigs, {
  useFakeData: {
    get() {
      return useFakeData;
    },
    enumerable: true,
  },
  clusterUpgradePlaybook: {
    get() {
      return clusterUpgradePlaybook;
    },
    enumerable: true,
  },
});

function testDefined(obj, key) {
  return obj[key] !== undefined && obj[key] !== null;
}

/**
 * Use this function to update configurations.  The default export __pluginConfigs__
 * cannot be edited directly.
 */
export function updateConfig(updates) {
  if (__DEV__) console.log('updateConfig:', updates);

  if (testDefined(updates, 'useFakeData')) {
    useFakeData = Boolean(updates.useFakeData);
  }

  if (testDefined(updates, 'clusterUpgradePlaybook')) {
    clusterUpgradePlaybook = String(updates.clusterUpgradePlaybook);
  }
}

export default pluginConfigs;
