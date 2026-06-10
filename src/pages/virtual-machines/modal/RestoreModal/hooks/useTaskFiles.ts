import { FormikProps } from 'formik';
import { RestoreModalForm } from '../types';
import { useEffect } from 'react';
import { selectBackupFiles } from 'store/mount-backup-modal/selectors';
import { useSelector } from 'react-redux';
import { selectFilteredHypervisorStorages } from 'store/restore-modal/selectors';

export const useTaskFiles = ({
  form,
}: {
  form: FormikProps<RestoreModalForm>;
}) => {
  const backupFiles = useSelector(selectBackupFiles) as BackupFile[];
  const filteredStorages = useSelector(selectFilteredHypervisorStorages);

  useEffect(() => {
    const filteredTaskFiles = backupFiles
      .filter(({ backupFileType }) =>
        ['DISK', 'DISK_INC', 'VM_IMAGE'].includes(backupFileType?.name),
      )
      .map((backupFile) => {
        const taskFile: RestoreModalForm['taskFiles'][number] = {
          backupFile,
          diskName: backupFile.path.split('/').pop(),
          originalDiskName: backupFile.path.split('/').pop(),
          originalDiskGuid: backupFile.guid,
          path: backupFile.path,
          excludedFromRestore: false,
          storageId:
            filteredStorages.find(
              ({ guid }) => guid === backupFile?.vmDisk?.originalStorage?.guid,
            )?.uuid || filteredStorages[0]?.uuid,
        };

        return taskFile;
      });

    void form?.setFieldValue('taskFiles', filteredTaskFiles);
  }, [backupFiles, filteredStorages, form]);
};

type BackupFile = {
  backup: any;
  backupFileType: { name: string };
  backupTime: number;
  encryption: number;
  format: any;
  guid: string;
  iscsiMountable: boolean;
  locations: any[];
  mountable: boolean;
  path: string;
  restoresTime: any[];
  size: number;
  underlyingStorageType?: any;
  vmDisk?: any;
};
