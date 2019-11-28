#!/bin/bash
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/intl-polyfill.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/plugin.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/vendor.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/vendors~intl-polyfill.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/vprotect.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/plugin.html root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'Pa$$w0rd' scp dist/vprotect-resources/vprotect.html root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
