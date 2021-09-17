import React, { useEffect, useRef } from 'react';
import { vprotectService } from '../../../services/vprotect-service';
import { Filesize } from '../../../components/convert/Filesize';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHypervisorClustersForHypervisorManager,
  getHypervisorManagersAvailableForBackup,
  getHypervisorStoragesForHypervisorManager,
  getRestorableBackups,
  setFilteredHypervisorStoragesAction,
  submitTask,
} from 'store/restore-modal/actions';
import {
  selectBackups,
  selectFilteredHypervisorStorages,
  selectHypervisorClusters,
  selectHypervisorManagers,
  selectHypervisorStorages,
  selectTask,
} from 'store/restore-modal/selectors';
import Select from 'components/input/reactive/Select';
import BackupSelect from 'components/input/reactive/BackupSelect';
import { selectSaved } from 'store/modal/selectors';
import Toggle from 'components/input/reactive/Toggle';
import ToggleText from 'components/input/reactive/ToggleText';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';

const storageDropdownTemplate = (option) => {
  return (
    <div>
      <span>{option.name}</span>
      {option.totalAvailableSpace && (
        <span>
          <Filesize bytes={option.totalAvailableSpace} />, free:{' '}
          <Filesize
            bytes={option.totalAvailableSpace - option.totalUsedSpace}
          />
        </span>
      )}
    </div>
  );
};

export const RestoreModal = ({ virtualEnvironment }) => {
  const dispatch = useDispatch();
  const formRef = useRef();

  useEffect(() => {
    dispatch(getRestorableBackups(virtualEnvironment));
  }, []);

  const backups = useSelector(selectBackups);
  const hypervisorManagers = useSelector(selectHypervisorManagers);
  const storages = useSelector(selectHypervisorStorages);
  const filteredStorages = useSelector(selectFilteredHypervisorStorages);
  const clusters = useSelector(selectHypervisorClusters);
  const task = useSelector(selectTask);

  const onBackupChange = (e) => {
    dispatch(
      getHypervisorManagersAvailableForBackup(e.value.guid, virtualEnvironment),
    );
  };

  const onHypervisorChange = async (e) => {
    await dispatch(getHypervisorStoragesForHypervisorManager(e.value.guid));
    await dispatch(getHypervisorClustersForHypervisorManager(e.value.guid));
  };

  const onClusterChange = async (event) => {
    const cluster = clusters.find((el) => el.uuid === event.value);
    dispatch(
      setFilteredHypervisorStoragesAction(
        !!cluster
          ? storages.filter((storage) => {
              return (
                !!storage.clusters &&
                !!storage.clusters.find((el) => cluster.guid === el.guid)
              );
            })
          : [],
      ),
    );
  };

  if (useSelector(selectSaved)) {
    formRef.current.handleSubmit();
  }
  return (
    <div className="form">
      <Formik
        enableReinitialize
        innerRef={formRef}
        initialValues={task}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(submitTask(values));
          setSubmitting(false);
        }}
      >
        {() => (
          <Form>
            <Field
              name="backup"
              component={BackupSelect}
              label="Backup"
              change={onBackupChange}
              required
              options={backups}
            />
            <Field
              name="hypervisorManager"
              component={Select}
              change={onHypervisorChange}
              optionLabel="url"
              label="Hypervisor Manager"
              required
              options={hypervisorManagers}
            />
            <Field
              name="restoreClusterId"
              component={Select}
              change={onClusterChange}
              valueProperty="uuid"
              optionLabel="name"
              required
              label="Import to an availability zone"
              options={clusters}
            />
            {!!filteredStorages.length && (
              <Field
                name="restoreStorageId"
                component={Select}
                itemTemplate={storageDropdownTemplate}
                optionLabel="name"
                valueProperty="uuid"
                required
                label="Import to storage"
                options={filteredStorages}
              />
            )}

            <Field
              name="overwrite"
              component={Toggle}
              label="Delete if virtual environment already exists"
            />
            <Field
              name="restoredPeName"
              component={ToggleText}
              label="Specify name of the restored Virtual Environment"
              textLabel="Restored Virtual Environment name"
            />
            {isNotOpenstackBuild && (
              <Field
                name="restoredDiskAllocationFormat"
                component={Select}
                optionLabel="name"
                label="Disk allocation format"
                required
                options={vprotectService.diskAllocationFormats}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
