import React from 'react';
import AppDefault from '../../AppDefault';
import { ReactNotifications } from 'react-notifications-component';

import 'react-notifications-component/dist/theme.css';
import '@patternfly/react-core/dist/styles/base.css';

/*
 * This component was created to implement React notifications component
 * because the notification was implemented only for openstack
 * not for local development
 */
const App = () => (
  <>
    <ReactNotifications />
    <AppDefault />
  </>
);
export default App;
