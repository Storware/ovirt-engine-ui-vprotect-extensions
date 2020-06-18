import {
  combineReducers,
  createStore,
  applyMiddleware,
  ThunkAction,
  Action,
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
import thunk from 'redux-thunk';

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
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
