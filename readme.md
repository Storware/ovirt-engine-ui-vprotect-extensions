# oVirt engine vProtect extension

## Development

#### Node modules
Use the [yarn](https://yarnpkg.com/) package manager to install node modules.
```bash
yarn install
```

#### API Configuration
Configure vProtect API url and credentials in the static/vprotect.json file in the config property.
```json
{
  "name": "vprotect",
  "url": "plugin/vprotect/plugin.html",
  "resourcePath": "vprotect-resources",
  "lazyLoad": false,

  "config": {
    "vProtectURL": "http://server_ip_address/api",
    "username": "admin",
    "password": "vPr0tect"
  }
}
```

#### Build
Use the [yarn](https://yarnpkg.com/) package manager to build the extension.
```bash
yarn build
```

#### Development server
Use command
```bash
yarn start
```
to start development server. This command uses mock integration with oVirt Engine.
Files that are responsible for connection with oVirt Engine are replaced 
with mock logic from integrations/dev-server-mock-plugin-api. Configure mock object in the plugin-api.js.

```js
function getPluginApi() {
  return {
    configObject: () => {
      return { // property that mocks config property from vprotect.json
        username: 'admin',
        password: 'vPr0tect',
        vProtectURL: 'https://server_ip_address/api'
      }
    },
    // function that mocks alert logic used in services/alert-service.js
    showToast: (toastType, text) => {
      return null
    }
  }
}

export default getPluginApi;
```

## Deployment
Note that plugins require version >=4.3 of oVirt web admin.

Put following files and directories (these are available in dist directory after build)

1. vprotect.json
2. vprotect-resources

to the /usr/share/ovirt-engine/ui-plugins/ directory in the Engine.


#### Configuration
Build command will generate the /dist directory with the /dist/vprotect.json file inside.
It will look like this:
```json
{
  "name": "vprotect",
  "url": "plugin/vprotect/plugin.html",
  "resourcePath": "vprotect-resources",
  "lazyLoad": false,

  "config": {
    "vProtectURL": "http://server_ip_address/api",
    "username": "admin",
    "password": "vPr0tect"
  }
}
```
Set the vProtect connection parameters in the config property.
