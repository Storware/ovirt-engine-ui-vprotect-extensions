import getPluginApi from './plugin-api';
import appInit from './services/app-init';
import { addPlaces } from './integrations/places';

import 'patternfly-react/dist/css/patternfly-react.css';
/*
    PatternFly 4
    ------------

    PF4 itself has multiple ways to import the CSS (or the scss versions) to consider:
      1. all in one (`patternfly.css`)
      2. all in one but without global style reset, to aid in compat with PF3 (`patternfly-no-reset.css`)
      3. base and then components and layouts as needed (`patternfly-base.css` and others)

    patternfly4-react handles things differently.  Via the react-style package, the components
    load (and unload) their CSS on demand.  Cool!  PF4-react also includes a `base.css` to load
    that is a modified version of pf4's #3 option.  This is also cool but with a big downside
    as the style resets still occur.  react-core doesn't provide a `base-no-reset.css` that would
    be ideal.  So...for now...instead of updating @patternfly/patternfly and @patternfly/react-core
    with everything that would be needed to do `base-no-reset.css`, we will do the PF4 #2 import
    option and let the components double up the styles.  This is probably the safest thing to
    do right now (4-Nov-2019).
 */
// import '@patternfly/patternfly/patternfly-no-reset.css'
import { vprotectService } from './services/vprotect-service';

const username = getPluginApi().configObject().username;
const password = getPluginApi().configObject().password;

getPluginApi().register({
  UiInit: () => {
    vprotectService.login(username, password).then((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      addPlaces();
    });
  },
});

appInit.run().then(() => {
  // proceed with plugin initialization (UI plugin infra will call UiInit)
  getPluginApi().ready();
});
