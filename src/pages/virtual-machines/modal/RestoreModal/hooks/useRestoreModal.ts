import { useContext } from 'react';
import { RestoreModalContext } from '../RestoreModalProvider';

export const useRestoreModal = () => {
  const context = useContext(RestoreModalContext);

  if (!context) {
    throw new Error('useRestoreModal must be used within RestoreModalProvider');
  }

  return context;
};
