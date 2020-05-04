import { supportedLocales, supportedTimeZones, defaultTimeZone } from '../../../constants'
import getPluginApi from '../../../plugin-api'
import { updateConfig } from '../../../plugin-config'
import { initLocale, initTimeZone } from '../../../utils/intl'

// polyfill Intl API (ECMA-402) if not natively supported
const polyfillIntlFn = (resolve, reject) => {
  if (!global.Intl) {
    // use dynamic import code splitting to fetch all required modules
    require.ensure([], require => {
      require('intl')
      require('intl/locale-data/jsonp/en')
      require('intl/locale-data/jsonp/de')
      require('intl/locale-data/jsonp/es')
      require('intl/locale-data/jsonp/fr')
      require('intl/locale-data/jsonp/it')
      require('intl/locale-data/jsonp/ja')
      require('intl/locale-data/jsonp/ko')
      require('intl/locale-data/jsonp/pt')
      require('intl/locale-data/jsonp/zh')
      require('intl/locale-data/jsonp/cs')
      resolve()
    }, 'intl-polyfill')
      .catch(error => { reject(`failed to load intl-polyfill: ${error}`) })
  } else {
    resolve()
  }
}

// determine and use current WebAdmin UI locale
const initApplicationLocaleFn = (resolve, reject) => {
  const currentLocale = getPluginApi().currentLocale()

  // TODO(sd): This should be simplified if/when currentTimeZone is added to the UI plugin API
  const currentTimeZone = getPluginApi().currentTimeZone ? getPluginApi().currentTimeZone() : defaultTimeZone

  if (supportedLocales.includes(currentLocale) && supportedTimeZones.includes(currentTimeZone)) {
    initLocale(currentLocale)
    initTimeZone(currentTimeZone)
    resolve()
  } else {
    reject(`Unsupported UI locale [${currentLocale}] or timezone [${currentTimeZone}]`)
  }
}

// update the app configuration based on the plugin config
const updateFromPluginConfig = (resolve, reject) => {
  if (__DEV__) console.log('pluginApi.configObject:', getPluginApi().configObject())
  let {
    useFakeData,
    clusterUpgradePlaybook
  } = getPluginApi().configObject() || {}

  try {
    useFakeData = typeof useFakeData === 'string'
      ? /^(true|t|yes|y)$/i.test(useFakeData)
      : Boolean(useFakeData)
  } catch (e) {
    reject('Failed to access or interpret [useFakeData] from PluginAPI config')
  }

  try {
    clusterUpgradePlaybook = /^[a-zA-Z](\w|-)*\w$/.test ? clusterUpgradePlaybook : undefined
  } catch (e) {
    reject('Failed to access or interpret [clusterUpgradePlaybook] from PluginAPI config')
  }

  updateConfig({
    useFakeData,
    clusterUpgradePlaybook
  })
  resolve()
}

export default {
  run () {
    return new Promise((resolve, reject) => {
      Promise.all([
        new Promise(initApplicationLocaleFn),
        new Promise(polyfillIntlFn),
        new Promise(updateFromPluginConfig)
      ])
        .then(() => { resolve() })
        .catch(error => {
          console.error(`Application init failed: ${error}`)
          reject(error)
        })
    })
  }
}
