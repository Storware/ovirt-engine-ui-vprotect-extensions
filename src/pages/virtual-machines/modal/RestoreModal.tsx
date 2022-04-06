import React, { useEffect, useRef, useState } from 'react';
import { vprotectService } from '../../../services/vprotect-service';
import { Filesize } from '../../../components/convert/Filesize';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHypervisorManagersAvailableForBackupBackupLocation,
  getHypervisorStoragesForHypervisorManager,
  getBackupLocations,
  setFilteredHypervisorStoragesAction,
  submitTask,
} from 'store/restore-modal/actions';
import {
  selectBackupLocations,
  selectFilteredHypervisorStorages,
  selectHypervisorClusters,
  selectHypervisorManagers,
  selectHypervisorStorages,
  selectTask,
} from 'store/restore-modal/selectors';
import Select from 'components/input/reactive/Select';
import { selectSaved } from 'store/modal/selectors';
import Toggle from 'components/input/reactive/Toggle';
import ToggleText from 'components/input/reactive/ToggleText';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import ToggleSelect from '../../../components/input/reactive/ToggleSelect';
import { selectNetwork } from 'store/network/selectors';
import { getNetwork, setNetworkAction } from 'store/network/actions';
import { hideModalAction } from 'store/modal/actions';

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
  const [clusterCopy, setClusterCopy] = useState(null);

  useEffect(() => {
    dispatch(getBackupLocations(virtualEnvironment));
  }, [virtualEnvironment]);

  const backupLocations = useSelector(selectBackupLocations);
  const hypervisorManagers = useSelector(selectHypervisorManagers);
  const storages = useSelector(selectHypervisorStorages);
  const filteredStorages = useSelector(selectFilteredHypervisorStorages);
  const clusters = useSelector(selectHypervisorClusters);
  const task = useSelector(selectTask);
  const networkList = useSelector(selectNetwork);

  useEffect(() => {
    if (!!task.hypervisorManager && networkList.length === 0) {
      dispatch(
        getNetwork({ hypervisorManagerGuid: task?.hypervisorManager.guid }),
      );
    }
  }, [task]);

  useEffect(() => {
    return () => {
      dispatch(setNetworkAction([]));
    };
  }, []);

  const onBackupLocationChange = (e) => {
    dispatch(
      getHypervisorManagersAvailableForBackupBackupLocation(
        e.value,
        virtualEnvironment,
      ),
    );
  };

  const onHypervisorChange = ({ value: { guid } }) => {
    dispatch(getHypervisorStoragesForHypervisorManager(guid));
  };

  const onClusterChange = async (event) => {
    const cluster = clusters.find((el) => el.uuid === event.value);
    setClusterCopy(cluster);
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
    // @ts-ignore
    formRef.current.handleSubmit();
  }
  return (
    <div className="form">
      <Formik
        enableReinitialize
        // @ts-ignore
        innerRef={formRef}
        initialValues={task}
        onSubmit={({ restoredNetworks = [], ...values }, { setSubmitting }) => {
          dispatch(
            submitTask({
              ...values,
              restoredNetworks:
                restoredNetworks.length === 0
                  ? !!networkList[0]
                    ? [networkList[0]]
                    : []
                  : [restoredNetworks],
            }),
          );
          setSubmitting(false);
          dispatch(hideModalAction());
        }}
      >
        {() => (
          <Form>
            <Field
              name="backupLocation"
              component={Select}
              label="Backup location to restore"
              optionLabel="name"
              change={onBackupLocationChange}
              required
              options={backupLocations}
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
                valueProperty="guid"
                required
                label="Import to storage"
                options={filteredStorages}
              />
            )}

            {!!filteredStorages.length && (
              <Field
                name="restoreToOriginalVolumeType"
                component={Toggle}
                label="Restore volumes to original volume types"
              />
            )}
            {clusterCopy && (
              <Field
                name="restoredNetworks"
                component={ToggleSelect}
                label="Select network interface card"
                optionLabel="name"
                options={networkList}
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
