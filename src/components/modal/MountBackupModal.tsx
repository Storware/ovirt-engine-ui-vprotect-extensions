import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaved } from 'store/modal/selectors';
import {
  checkIfIscsiMountable,
  getBackupFilesystems,
  getMountedBackup,
  setTaskAction,
  submitTask,
} from 'store/mount-backup-modal/actions';
import {
  selectBackupFiles,
  selectIscsiMountable,
  selectManualMountFilesystems,
  selectMountableBackups,
  selectNodes,
  selectTask,
} from 'store/mount-backup-modal/selectors';
import { BackupDropdown } from '../input/BackupDropdown';
import Select from '../input/Select';
import Text from '../input/Text';
import Radio from '../input/Radio';
import moment from 'moment-timezone';
import Check from '../input/Check';
import { Filesize } from '../convert/Filesize';
import { Column } from 'primereact/column';
import Table from '../table/primereactTable';
import { sizeTemplate } from '../table/templates';
import { Chips } from 'primereact/chips';

const manuallyMountParameterLabel = (el) => {
  return (
    <span>
      {el.fileSystem?.volume}{' '}
      {el.fileSystem?.label ? '[' + el.fileSystem?.label + ']' : ''} (
      {el.fileSystem?.type}, <Filesize bytes={el.fileSystem?.size} />)
    </span>
  );
};

export const nameTemplate = (rowData) => {
  return (
    <span>{rowData.path.split('/')[rowData.path.split('/').length - 1]}</span>
  );
};

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

export const MountBackupModal = ({ guid }) => {
  const dispatch = useDispatch();
  const [iscsiDisks, setIscsiDisks] = useState([]);

  useEffect(() => {
    dispatch(getMountedBackup(guid));
  }, []);

  const [
    mountableBackups,
    nodes,
    task,
    manualMountFileSystems,
    backupFiles,
    iscsiMountable,
  ] = [
    useSelector(selectMountableBackups),
    useSelector(selectNodes),
    useSelector(selectTask),
    useSelector(selectManualMountFilesystems),
    useSelector(selectBackupFiles),
    useSelector(selectIscsiMountable),
  ];

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

  if (useSelector(selectSaved)) {
    dispatch(submitTask(task));
  }

  return (
    <div>
      <div className="form">
        <label>Select backup to mount</label>
        <BackupDropdown
          value={task.backup}
          onChange={(event) => {
            autoMountFileSystem.mountPath =
              '/mnt/vprotect/' +
              event.protectedEntity.name +
              '/' +
              moment(event.snapshotTime).format('YYYYMMDD_HHmmss');

            dispatch(getBackupFilesystems(event));
            dispatch(checkIfIscsiMountable(event));
            dispatch(
              setTaskAction({
                ...task,
                backup: event,
              }),
            );
          }}
          options={mountableBackups}
        />

        <Select
          label="Choose node"
          optionLabel="name"
          value={task.node}
          options={nodes}
          dataKey="guid"
          required
          onChange={(event) =>
            dispatch(
              setTaskAction({
                ...task,
                node: event.value,
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

        {task.mode?.name === 'AUTO' && (
          <Text
            label="Mount point for backup"
            value={task.mountedFileSystems[0].mountPath}
            onChange={(e) =>
              dispatch(
                setTaskAction({
                  ...task,
                  mountedFileSystems: [
                    {
                      mountPath: e.target.value,
                    },
                  ],
                }),
              )
            }
          />
        )}

        {task.mode?.name === 'MANUAL' && (
          <div>
            <label>PARAMETERS FOR MOUNTING FILESYSTEMS MANUALLY</label>
            {mountedFileSystems['MANUAL'].map((el) => {
              return (
                <div key={el}>
                  <Check
                    label={manuallyMountParameterLabel(el)}
                    onChange={(e) => {
                      el.selected = e.checked;
                      dispatch(
                        setTaskAction({
                          ...task,
                          mountedFileSystems: mountedFileSystems[
                            'MANUAL'
                          ].filter((el) => el.selected),
                        }),
                      );
                    }}
                    checked={el.selected}
                  />
                  <Text
                    label="Mount point"
                    value={el.mountPath}
                    onChange={(e) => {
                      el.mountPath = e.target.value;
                      dispatch(setTaskAction({ ...task }));
                    }}
                  />
                </div>
              );
            })}
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
                      mountedDisks: e.value.map((el) => {
                        return {
                          backupFile: {
                            guid: el.guid,
                            name: el.path.split('/')[
                              el.path.split('/').length - 1
                            ],
                          },
                        };
                      }),
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
      </div>
    </div>
  );
};
