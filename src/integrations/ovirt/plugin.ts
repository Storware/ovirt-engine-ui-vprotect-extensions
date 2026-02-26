import getPluginApi from 'integrations/ovirt/plugin-api';
import appInit from 'integrations/ovirt/app-init';
import { addPlaces } from 'integrations/ovirt/places';
import '@patternfly/react-core/dist/styles/base.css';
import { vprotectService } from 'services/vprotect-service';

getPluginApi.register({
  UiInit: () => {
    const config = getPluginApi.configObject();
    vprotectService.login(config.username, config.password).then((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      addPlaces();
    });
  },
});

appInit.run().then(() => {
  // proceed with plugin initialization (UI plugin infra will call UiInit)
  getPluginApi.ready();
});
