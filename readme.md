# oVirt engine vProtect extension

## Installation

#### Build
Use the [yarn](https://yarnpkg.com/) package manager to build the extension.
```bash
yarn build
```

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
    "vProtectURL": "http://10.40.0.55:8080/api",
    "username": "admin",
    "password": "vPr0tect"
  }
}
```
Set the vProtect connection parameters in the config property.

#### Deployment
Put following files and directories 
* vprotect.json
* vprotect-resources

to the /usr/share/ovirt-engine/ui-plugins/ directory in the Engine.

