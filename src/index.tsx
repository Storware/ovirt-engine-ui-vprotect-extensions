import 'chart.js/auto';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap-grid.css';
import appInit from 'integrations/app-init';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';

import './theme/theme.scss';

import { Provider } from 'react-redux';
import { store } from './store';

const appRoot = document.getElementById('app');

void appInit.run().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    appRoot,
  );
});
