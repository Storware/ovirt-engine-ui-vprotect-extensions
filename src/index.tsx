import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap-grid.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import appInit from 'integrations/app-init';

import './theme/theme.scss';

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
