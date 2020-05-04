import appInit from './components/vprotect/services/app-init'
import { defaultLocale, defaultTimeZone } from './constants'
import { resetApi } from './plugin-api'
import { clearMessageCache } from './utils/intl'

beforeEach(() => {
  // stubbed UI plugin API functions, exposed via `this.pluginApiStubs`
  const pluginApiStubs = {}
  ;[
    'register',
    'ready',
    'configObject',
    'addPrimaryMenuPlace',
    'setPlaceUnloadHandler',
    'revealPlace',
    'setSearchString',
    'engineBaseUrl',
    'currentLocale',
    'currentTimeZone' // TODO(vs) this API function isn't currently available
  ].forEach(apiMethod => {
    pluginApiStubs[apiMethod] = jest.fn().mockName(apiMethod)
  })
  pluginApiStubs.currentLocale.mockReturnValue(defaultLocale)
  pluginApiStubs.currentTimeZone.mockReturnValue(defaultTimeZone)

  // ensure the global pluginApi function exists and is unique for each test
  window.top.pluginApi = () => pluginApiStubs
  resetApi()

  clearMessageCache()

  return new Promise((resolve, reject) => {
    appInit.run()
      .then(() => { resolve() })
      .catch(error => { reject(error) })
  })
})

afterEach(() => {
  delete window.top.pluginApi
})
