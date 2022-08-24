import {
  combineReducers,
  createStore,
  applyMiddleware,
} from '@reduxjs/toolkit';
import user from './user';
import virtualMachine from './virtual-machine';
import virtualMachines from './virtual-machines';
import mountedBackups from './mounted-backups';
import loading from './loading';
import modal from './modal';
import policies from './policies';
import backupModal from './backup-modal';
import restoreModal from './restore-modal';
import mountBackupModal from './mount-backup-modal';
import policy from './policy';
import schedules from './schedules';
import schedule from './schedule';
import chargebackChart from './chargeback-chart';
import reporting from './reporting';
import chargebackChartForm from './chargeback-chart-form';
import thunk from 'redux-thunk';
import mailingTable from './mailingTable';
import mailing from './mailing';
import credentials from './credentials';
import network from './network';
import exportReport from './export-report';

export const rootReducer = combineReducers({
  user,
  loading,
  virtualMachine,
  virtualMachines,
  mountedBackups,
  policies,
  backupModal,
  restoreModal,
  mountBackupModal,
  policy,
  schedules,
  schedule,
  modal,
  chargebackChart,
  reporting,
  chargebackChartForm,
  mailingTable,
  mailing,
  credentials,
  network,
  exportReport,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
