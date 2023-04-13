import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaved } from 'store/modal/selectors';
import {
  checkIfIscsiMountable,
  getBackupFilesystems,
  setMountedBackup,
  setTaskAction,
  submitTask,
} from 'store/mount-backup-modal/actions';
import {
  selectBackupFiles,
  selectIscsiMountable,
  selectManualMountFilesystems,
  selectMountableBackups,
  selectTask,
} from 'store/mount-backup-modal/selectors';
import { BackupDropdown } from '../input/BackupDropdown';
import Text from '../input/Text';
import Radio from '../input/Radio';
import moment from 'moment-timezone';
import Check from '../input/Check';
import { Filesize } from '../convert/Filesize';
import { Column } from 'primereact/column';
import Table from '../table/primereactTable';
import { sizeTemplate } from '../table/templates';
import { Chips } from 'primereact/chips';
import { getBackupLocations } from 'store/restore-modal/actions';
import { selectBackupLocations } from 'store/restore-modal/selectors';
import { getUnmountPeriodForMountedBackups } from 'utils/user';
import { Button } from 'primereact/button';
import {
  hideModalAction,
  saveModalAction,
  showFooterAction,
} from 'store/modal/actions';

const manuallyMountParameterLabel = (el) => (
  <span>
    {el.fileSystem?.volume}{' '}
    {el.fileSystem?.label ? '[' + el.fileSystem?.label + ']' : ''} (
    {el.fileSystem?.type}, <Filesize bytes={el.fileSystem?.size} />)
  </span>
);

export const nameTemplate = (rowData) => (
  <span>{rowData.path.split('/')[rowData.path.split('/').length - 1]}</span>
);

const modes = [
  {
    name: 'Mount filesystems automatically',
    value: { name: 'AUTO' },
  },
  {
    name: 'Specify filesytems to be mounted',
    value: { name: 'MANUAL' },
  },
  {
    name: 'Share drives over iSCSI',
    value: { name: 'ISCSI' },
  },
];

let autoMountFileSystem = {
  mountPath: null,
};

export const MountBackupModal = ({ virtualEnvironment, backups }) => {
  const dispatch = useDispatch();
  const [iscsiDisks, setIscsiDisks] = useState([]);

  useEffect(() => {
    dispatch(getBackupLocations(virtualEnvironment));
    dispatch(setMountedBackup(virtualEnvironment.guid, backups));
  }, [virtualEnvironment]);

  const [
    mountableBackups,
    backupsLocations,
    task,
    manualMountFileSystems,
    backupFiles,
    iscsiMountable,
  ] = [
    useSelector(selectMountableBackups),
    useSelector(selectBackupLocations),
    useSelector(selectTask),
    useSelector(selectManualMountFilesystems),
    useSelector(selectBackupFiles),
    useSelector(selectIscsiMountable),
  ];

  useEffect(() => {
    dispatch(
      setTaskAction({
        ...task,
        backupLocation: backupsLocations[0],
      }),
    );
  }, [backupsLocations]);

  let filteredModes = modes;
  if (manualMountFileSystems.length === 0) {
    filteredModes = modes.filter((el) => el.value.name !== 'MANUAL');
  }

  if (!iscsiMountable) {
    filteredModes = modes.filter((el) => el.value.name !== 'ISCSI');
  }

  const mountedFileSystems = {
    AUTO: [autoMountFileSystem],
    MANUAL: manualMountFileSystems,
    ISCSI: [],
  };

  const submit = () => {
    dispatch(submitTask(task));
  };

  return (
    <div>
      <div className="form">
        <label>Select backup to mount</label>
        <BackupDropdown
          options={backupsLocations}
          value={task.backupLocation}
          onChange={(event) => {
            const i = backupsLocations.findIndex(
              ({ guid }) => event.guid === guid,
            );
            autoMountFileSystem = {
              ...autoMountFileSystem,
              mountPath:
                '/mnt/vprotect/' +
                mountableBackups[i]?.protectedEntity?.name +
                '/' +
                moment(event.snapshotTime).format('YYYYMMDD_HHmmss'),
            };

            dispatch(getBackupFilesystems(mountableBackups[i]));
            dispatch(checkIfIscsiMountable(mountableBackups[i]));
            dispatch(
              setTaskAction({
                ...task,
                backupLocation: event,
                mode: modes[0].value,
                mountedFileSystems: [autoMountFileSystem],
              }),
            );
          }}
        />
        <div className="mb-3"></div>

        <Text
          // same default value as in the RestoreAndMountTask
          inputValue={getUnmountPeriodForMountedBackups()}
          type="number"
          label="Time to auto-umount [h]"
          change={({ value }) =>
            dispatch(
              setTaskAction({
                ...task,
                unmountTime: parseInt(value, 10) * 1000 * 60 * 60,
              }),
            )
          }
        />

        <Radio
          value={task.mode}
          options={filteredModes}
          onChange={(event) =>
            dispatch(
              setTaskAction({
                ...task,
                mode: event.value,
                mountedFileSystems: mountedFileSystems[event.value?.name],
              }),
            )
          }
        />

        {task.mode?.name === 'MANUAL' && (
          <div>
            <label>PARAMETERS FOR MOUNTING FILESYSTEMS MANUALLY</label>
            {mountedFileSystems['MANUAL'].map((el) => (
              <div key={el}>
                <Check
                  label={manuallyMountParameterLabel(el)}
                  onChange={(e) => {
                    el.selected = e.checked;
                    dispatch(
                      setTaskAction({
                        ...task,
                        mountedFileSystems: mountedFileSystems['MANUAL'].filter(
                          (el) => el.selected,
                        ),
                      }),
                    );
                  }}
                  checked={el.selected}
                />
              </div>
            ))}
          </div>
        )}

        {task.mode?.name === 'ISCSI' && (
          <div>
            <div>
              <label>PARAMETERS FOR SHARING DRIVES OVER ISCSI</label>
              <Table
                selection={iscsiDisks}
                onSelectionChange={(e) => {
                  setIscsiDisks(e.value);
                  dispatch(
                    setTaskAction({
                      ...task,
                      mountedDisks: e.value.map((el) => ({
                        backupFile: {
                          guid: el.guid,
                          name: el.path.split('/')[
                            el.path.split('/').length - 1
                          ],
                        },
                      })),
                    }),
                  );
                }}
                value={backupFiles}
              >
                <Column selectionMode="multiple" style={{ width: '3em' }} />
                <Column field="name" header="Name" body={nameTemplate} />
                <Column field="size" header="Size" body={sizeTemplate} />
              </Table>
            </div>
            <div>
              <div>
                <h4>Provide list of allowed iSCSI initiators (IQNs)</h4>
                <Chips
                  value={task.allowedClients}
                  separator=","
                  className="w-100"
                  onChange={(e) => {
                    dispatch(
                      setTaskAction({
                        ...task,
                        allowedClients: e.value,
                      }),
                    );
                  }}
                />
                <div>
                  <small>Comma separated</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>{' '}
      <div className="d-flex justify-content-between">
        <Button
          label="Cancel"
          icon="pi pi-times"
          onClick={() => {
            dispatch(hideModalAction());
            dispatch(showFooterAction());
          }}
          className="p-button-text"
        />
        <Button label={'Save'} icon="pi pi-check" onClick={() => submit()} />
      </div>
    </div>
  );
};
