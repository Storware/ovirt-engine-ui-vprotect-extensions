# oVirt engine vProtect extension

## Installation

#### Download
Download the package /Add-ons/vprotect-ovirt-plugin.tar.gz from our FTP.

#### Configuration
Open the vprotect.json file. Set the vProtect connection parameters in the "config" property
(change "vProtectURL", "username" and "password" fields value). 
The "vProtectURL" field is an address to the vProtect server. This value should have "/api" at the end.
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

#### Deployment
Put following files and directories 

1. vprotect.json
2. vprotect-resources

to the /usr/share/ovirt-engine/ui-plugins/ directory in the Engine.

