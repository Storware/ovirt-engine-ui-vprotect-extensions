import getPluginApi from 'integrations/plugin-api';
import appInit from 'integrations/app-init';
import { addPlaces } from 'integrations/places';
import 'patternfly-react/dist/css/patternfly-react.css';
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
