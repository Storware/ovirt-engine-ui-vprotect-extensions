#!/bin/bash
sshpass -p 'P@ssw0rd' scp -r dist/vprotect-resources root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/
sshpass -p 'P@ssw0rd' scp dist/vprotect.json root@10.40.0.39:/usr/share/ovirt-engine/ui-plugins/
