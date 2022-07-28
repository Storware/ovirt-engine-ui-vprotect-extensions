import React from 'react';
import AppDefault from '../../AppDefault';
import { ReactNotifications } from 'react-notifications-component';

import 'react-notifications-component/dist/theme.css';
import '@patternfly/react-core/dist/styles/base.css';
import { Nav } from 'integrations/dev/Nav';

/*
 * This component was created to implement additional components for local dev server
 * because some components was implemented only for specified environments
 */
const App = () => (
  <>
    <Nav />
    <ReactNotifications />
    <AppDefault />
  </>
);
export default App;
