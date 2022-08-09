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
  getBackupFiles, getFlavorsForHypervisorManager,
} from 'store/restore-modal/actions';
import {
  selectBackupFiles,
  selectBackupLocations,
  selectFilteredHypervisorStorages,
  selectHypervisorClusters,
  selectHypervisorManagers,
  selectHypervisorStorages,
  selectTask,
  selectFlavors
} from 'store/restore-modal/selectors';
import Select from 'components/input/reactive/Select';
import { selectSaved } from 'store/modal/selectors';
import Toggle from 'components/input/reactive/Toggle';
import ToggleText from 'components/input/reactive/ToggleText';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import ToggleSelect from '../../../components/input/reactive/ToggleSelect';
import { selectNetwork } from 'store/network/selectors';
import { getNetwork, setNetworkAction } from 'store/network/actions';
import { hideModalAction, showFooterAction } from 'store/modal/actions';
import SelectStoragesWithDiskName from 'pages/virtual-machines/modal/components/SelectStoragesWithDiskName';

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

  useEffect(
    () => () => {
      dispatch(setNetworkAction([]));
    },
    [],
  );

  const onBackupLocationChange = (e) => {
    dispatch(
      getHypervisorManagersAvailableForBackupBackupLocation(
        e.value,
        virtualEnvironment,
      ),
    );
    dispatch(getBackupFiles(e.value));
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
        !!cluster
          ? storages.filter(
              (storage) =>
                !!storage.clusters &&
                !!storage.clusters.find((el) => cluster.guid === el.guid),
            )
          : [],
      ),
    );
  };

  const filterTaskFiles = (arr) =>
    [...arr]
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
          filteredStorages.find(({ guid }) => guid === backupFile.storageId)
            ?.guid || filteredStorages[0]?.guid,
      }));

  useEffect(() => {
    setBackupFilesFiltered(filterTaskFiles(backupFiles));
  }, [backupFiles]);

  if (useSelector(selectSaved)) {
    // @ts-ignore
    formRef.current.handleSubmit();
  }
  // @ts-ignore
  return (
    <div className="form">
      <Formik
        // @ts-ignore
        innerRef={formRef}
        initialValues={{
          ...task,
          taskFiles: backupFilesFiltered,
          isDiskLayoutActive: false,
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
          // tslint:disable-next-line:no-shadowed-variable
          const { isDiskLayoutActive, ...rest } = values;
          dispatch(
            submitTask({
              ...rest,
            }),
          );
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
              label={isNotOpenstackBuild ? 'Cluster' : 'Import to an availability zone'}
              options={clusters}
            />

            {filteredStorages.length > 0 && (
              <Field
                name="restoreToOriginalVolumeType"
                component={Toggle}
                label="Restore volumes to original volume types"
              />
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

            {!values.restoreToOriginalVolumeType && (
              <>
                <Field
                  name="isDiskLayoutActive"
                  label="Customize disk layout"
                  component={Toggle}
                />

                {values.isDiskLayoutActive && (
                  <SelectStoragesWithDiskName
                    data={values.taskFiles}
                    setFieldValue={setFieldValue}
                    hvStorages={filteredStorages}
                  />
                )}
              </>
            )}

            <>
              <Field
                name="isFlavorSectionActive"
                label="Select flavor"
                component={Toggle}
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
              label={'Delete if virtual environment already exists' + (isNotOpenstackBuild ? '' : ' (all existing VMs with this name in target project)')}
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
