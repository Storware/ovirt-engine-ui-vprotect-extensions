import { Toolbar } from '@patternfly/react-core';
import { Button } from 'primereact/button';
import { useInfoBar } from './useInfoBar';

export function InfoBar() {
  const {
    fullTimeZoneName,
    pluginVersion,
    synchronizeInventory,
    isNotOpenstackBuild,
  } = useInfoBar();

  return (
    <Toolbar>
      <div className={'d-flex flex-row justify-content-between'}>
        <div>Timezone: {fullTimeZoneName}</div>
        <div>Plugin version: {pluginVersion}</div>

        {isNotOpenstackBuild && (
          <div className={'form-group'}>
            <Button
              label="Synchronize inventory"
              onClick={synchronizeInventory}
            />
          </div>
        )}
      </div>
    </Toolbar>
  );
}
