import { VirtualEnvironment } from 'types/virtual-environment';
import { BackupLocation } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectBackupLocations } from 'store/restore-modal/selectors';
import { useEffect } from 'react';
import { getBackupLocations } from 'store/restore-modal/actions';

export const useBackupLocations = ({
  virtualEnvironment,
}: {
  virtualEnvironment: VirtualEnvironment;
}) => {
  const backupLocations: BackupLocation[] = useSelector(selectBackupLocations);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBackupLocations(virtualEnvironment));
  }, [dispatch, virtualEnvironment]);

  return { backupLocations };
};
