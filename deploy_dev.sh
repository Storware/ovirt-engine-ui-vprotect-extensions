#!/bin/bash
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/intl-polyfill.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/vendor.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/vendors~intl-polyfill.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/plugin.html root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/virtual-machine-list.html root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/task-console.html root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/dashboard.html root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/plugin.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/virtual-machine-list.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/task-console.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
sshpass -p 'P@ssw0rd' scp dist/vprotect-resources/dashboard.js root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/vprotect-resources
