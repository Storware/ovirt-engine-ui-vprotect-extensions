import React, { useEffect, useRef } from 'react';
import { vprotectService } from '../../../services/vprotect-service';
import { Filesize } from '../../../components/convert/Filesize';
import { RestoreAndImportTask } from 'model/tasks/restore-and-import-task';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHypervisorClustersForHypervisorManager,
  getHypervisorManagersAvailableForBackup,
  getHypervisorStoragesForHypervisorManager,
  getRestorableBackups,
  getProjectsForHypervisorManager,
  setFilteredHypervisorStoragesAction,
  submitTask,
} from 'store/restore-modal/actions';
import {
  selectBackups,
  selectFilteredHypervisorStorages,
  selectHypervisorClusters,
  selectHypervisorManagers,
  selectHypervisorStorages,
} from 'store/restore-modal/selectors';
import Select from 'components/input/reactive/Select';
import BackupSelect from 'components/input/reactive/BackupSelect';
import { selectSaved } from 'store/modal/selectors';
import Toggle from 'components/input/reactive/Toggle';
import ToggleText from 'components/input/reactive/ToggleText';
import {selectProjectsForHypervisorManager} from "../../../store/restore-modal/selectors";

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

  let backups = useSelector(selectBackups);
  let hypervisorManagers = useSelector(selectHypervisorManagers);
  let storages = useSelector(selectHypervisorStorages);
  let filteredStorages = useSelector(selectFilteredHypervisorStorages);
  let clusters = useSelector(selectHypervisorClusters);
  let projectsForHypervisorManager = useSelector(selectProjectsForHypervisorManager);
  let task = new RestoreAndImportTask();
  let selectedBackup = backups[0];

  const onBackupChange = (e) => {
    dispatch(
      getHypervisorManagersAvailableForBackup(
        e.value.guid,
        virtualEnvironment,
        task,
      ),
    );
    selectedBackup = e;
  };

  const onHypervisorChange = async (e) => {
    await dispatch(getHypervisorStoragesForHypervisorManager(e.value.guid));
    await dispatch(getHypervisorClustersForHypervisorManager(e.value.guid));
    await dispatch(getProjectsForHypervisorManager(e.value.guid));
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
        {({ values, isSubmitting }) => (
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
            {!!filteredStorages.length && !(selectedBackup.vmExportImportMode && selectedBackup.vmExportImportMode.name === "DISK_ATTACHMENT") && (
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
            <Field
              name="restoredDiskAllocationFormat"
              component={Select}
              optionLabel="name"
              label="Disk allocation format"
              required
              options={vprotectService.diskAllocationFormats}
            />
            {!!values.hypervisorManager && ['KUBERNETES', 'OPENSHIFT', 'OPENSTACK'].includes(values.hypervisorManager.type.name) && (
              <Field
                name="restoreProject"
                component={Select}
                optionLabel="name"
                label="Restored project name"
                required
                options={projectsForHypervisorManager}
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
