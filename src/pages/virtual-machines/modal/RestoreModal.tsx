import React, { useEffect, useRef, useState } from 'react';
import { vprotectService } from 'services/vprotect-service';
import { Filesize } from 'components/convert/Filesize';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHypervisorManagersAvailableForBackupBackupLocation,
  getHypervisorStoragesForHypervisorManager,
  getBackupLocations,
  setFilteredHypervisorStoragesAction,
  submitTask,
  getBackupFiles,
  getFlavorsForHypervisorManager,
} from 'store/restore-modal/actions';
import {
  selectBackupFiles,
  selectBackupLocations,
  selectFilteredHypervisorStorages,
  selectHypervisorClusters,
  selectHypervisorManagers,
  selectHypervisorStorages,
  selectTask,
  selectFlavors,
} from 'store/restore-modal/selectors';
import Select from 'components/input/reactive/Select';
import { selectSaved } from 'store/modal/selectors';
import Toggle from 'components/input/reactive/Toggle';
import ToggleText from 'components/input/reactive/ToggleText';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import ToggleSelect from '../../../components/input/reactive/ToggleSelect';
import { selectNetwork } from 'store/network/selectors';
import { getNetwork, setNetworkAction } from 'store/network/actions';
import {
  hideFooterAction,
  hideModalAction,
  saveModalAction,
  showFooterAction,
} from 'store/modal/actions';
import SelectStoragesWithDiskName from 'pages/virtual-machines/modal/components/SelectStoragesWithDiskName';
import { Button } from 'primereact/button';

export const storageDropdownTemplate = (option) => (
  <div>
    <span>{option.name}</span>
    {option.totalAvailableSpace && (
      <span>
        <Filesize bytes={option.totalAvailableSpace} />, free:{' '}
        <Filesize bytes={option.totalAvailableSpace - option.totalUsedSpace} />
      </span>
    )}
  </div>
);

export const RestoreModal = ({ virtualEnvironment }) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const [clusterCopy, setClusterCopy] = useState(null);
  const [backupFilesFiltered, setBackupFilesFiltered] = useState([]);
  const [backupLocationCopy, setBackupLocationCopy] = useState();

  useEffect(() => {
    dispatch(getBackupLocations(virtualEnvironment));
    dispatch(showFooterAction());
  }, [virtualEnvironment]);

  const backupLocations = useSelector(selectBackupLocations);
  const backupFiles = useSelector(selectBackupFiles);
  const hypervisorManagers = useSelector(selectHypervisorManagers);
  const storages = useSelector(selectHypervisorStorages);
  const filteredStorages = useSelector(selectFilteredHypervisorStorages);
  const flavors = useSelector(selectFlavors);
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
    dispatch(setNetworkAction([]));
    dispatch(hideFooterAction());
  }, []);

  const onBackupLocationChange = (value) => {
    dispatch(
      getHypervisorManagersAvailableForBackupBackupLocation(
        value,
        virtualEnvironment,
      ),
    );
    setBackupLocationCopy(value);
    dispatch(getBackupFiles(value));
  };

  const onHypervisorChange = ({ value: { guid } }) => {
    dispatch(getHypervisorStoragesForHypervisorManager(guid));
    dispatch(getFlavorsForHypervisorManager(guid));
  };

  const onClusterChange = async (event) => {
    const cluster = clusters.find((el) => el.uuid === event.value);
    setClusterCopy(cluster);
    dispatch(
      setFilteredHypervisorStoragesAction(
        storages.filter(
          (storage) =>
            !!storage.clusters &&
            !!storage.clusters.find((el) => cluster.guid === el.guid),
        ),
      ),
    );
  };

  const filterTaskFiles = (arr) =>
    arr
      .filter(({ backupFileType }) =>
        ['DISK', 'DISK_INC', 'VM_IMAGE'].includes(backupFileType?.name),
      )
      .map((backupFile) => ({
        backupFile,
        originalDiskName: backupFile.path.split('/').pop(),
        diskName: backupFile.path.split('/').pop(),
        path: backupFile.path,
        excludedFromRestore: backupFile.vmDisk.excludedFromBackup,
        storageId:
          filteredStorages.find(({ uuid }) => uuid === backupFile.storageId)
            ?.uuid ||
          filteredStorages.find(
            ({ guid }) => guid === backupFile?.vmDisk?.originalStorage?.guid,
          )?.uuid ||
          filteredStorages[0]?.uuid,
      }));

  useEffect(() => {
    setBackupFilesFiltered(filterTaskFiles(backupFiles));
  }, [backupFiles]);

  useEffect(() => {
    setBackupFilesFiltered(filterTaskFiles(backupFiles));
  }, [filteredStorages]);

  if (useSelector(selectSaved)) {
    // @ts-ignore
    formRef.current.handleSubmit();
  }
  return (
    <div className="form">
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={{
          ...task,
          taskFiles: backupFilesFiltered,
          backupLocation: backupLocationCopy ?? task.backupLocation,
          restoreClusterId: clusterCopy?.uuid,
          isDiskLayoutActive: false,
          restoreToOriginalVolumeType: true,
          restoreVmFlavor: virtualEnvironment.vmFlavor,
          restoredNetworks: task.restoredNetworks.map(
            (networkInterfaceCard) => ({
              ...networkInterfaceCard,
              network: networkList.filter(
                ({ guid }) => guid === networkInterfaceCard.network.guid,
              )[0],
            }),
          ),
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (!values.isFlavorSectionActive) {
            values.restoreVmFlavor = virtualEnvironment.vmFlavor;
          }
          dispatch(submitTask(values));
          setSubmitting(false);
          dispatch(hideModalAction());
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Field
              name="backupLocation"
              component={Select}
              label="Backup location to restore"
              optionLabel="name"
              onChange={({ value }) => onBackupLocationChange(value)}
              required
              options={backupLocations}
            />
            <Field
              name="hypervisorManager"
              component={Select}
              onChange={onHypervisorChange}
              optionLabel="url"
              label="Hypervisor Manager"
              required
              disabled
              options={hypervisorManagers}
            />
            <Field
              name="restoreClusterId"
              component={Select}
              onChange={onClusterChange}
              valueProperty="uuid"
              optionLabel="name"
              required
              label={
                isNotOpenstackBuild
                  ? 'Cluster'
                  : 'Import to an availability zone'
              }
              options={clusters}
            />

            {filteredStorages.length > 0 && (
              <>
                <Field
                  name="restoreToOriginalVolumeType"
                  component={Toggle}
                  label="Restore volumes to original volume types"
                />

                {!values.restoreToOriginalVolumeType && (
                  <SelectStoragesWithDiskName
                    data={values.taskFiles}
                    setFieldValue={setFieldValue}
                    hvStorages={filteredStorages}
                  />
                )}
              </>
            )}
            {clusterCopy &&
              task.restoredNetworks.map((networkInterfaceCard, id) => (
                <Field
                  key={id}
                  name={`restoredNetworks[${id}].network`}
                  component={ToggleSelect}
                  label={`Select network interface card ${networkInterfaceCard.networkInterfaceCard.name}`}
                  optionLabel="name"
                  options={networkList}
                />
              ))}

            <>
              <Field
                name="isFlavorSectionActive"
                component={(props) => (
                  <Toggle label="Select flavor" {...props} />
                )}
              />

              {values.isFlavorSectionActive && (
                <Field
                  name="restoreVmFlavor"
                  component={Select}
                  optionLabel="name"
                  required
                  label="Flavor"
                  options={flavors}
                />
              )}
            </>

            <Field
              name="overwrite"
              component={Toggle}
              label={
                'Delete if virtual environment already exists' +
                (isNotOpenstackBuild
                  ? ''
                  : ' (all existing VMs with this name in target project)')
              }
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

            <div
              className="mt-2 d-flex justify-content-end"
              style={{ gap: '1rem' }}
            >
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={() => dispatch(hideModalAction())}
                className="p-button-text"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={() => dispatch(saveModalAction())}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
