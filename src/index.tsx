import React from 'react';
import ReactDOM from 'react-dom';

import appInit from 'integrations/app-init';

import 'patternfly/dist/css/patternfly.min.css';
import 'patternfly/dist/css/patternfly-additions.min.css';
import 'patternfly-react/dist/css/patternfly-react.css';

import './theme/theme.scss';

import 'bootstrap/dist/css/bootstrap-grid.css';

import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';

const appRoot = document.getElementById('app');

appInit.run().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    appRoot,
  );
});
