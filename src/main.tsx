import ReactDOM from 'react-dom';
import { ViteApp } from './ViteApp';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/md-light-indigo/theme.css';
import './theme/theme.scss';

import { store } from './store';
import { Provider } from 'react-redux';

const appRoot = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>
    <ViteApp />
  </Provider>,
  appRoot,
);
