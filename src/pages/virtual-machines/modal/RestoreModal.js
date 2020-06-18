import React, {useEffect, useRef} from 'react'
import {vprotectService} from '../../../services/vprotect-service'
import {Filesize} from '../../../components/convert/Filesize'
import {RestoreAndImportTask} from 'model/tasks/restore-and-import-task'
import {Field, Form, Formik} from 'formik'
import {useDispatch, useSelector} from 'react-redux'
import {
  getHypervisorClustersForHypervisorManager,
  getHypervisorManagersAvailableForBackup,
  getHypervisorStoragesForHypervisorManager,
  getRestorableBackups, setFilteredHypervisorStoragesAction, submitTask
} from 'store/restore-modal/actions'
import {
  selectBackups, selectFilteredHypervisorStorages,
  selectHypervisorClusters,
  selectHypervisorManagers,
  selectHypervisorStorages
} from 'store/restore-modal/selectors'
import Select from 'components/input/reactive/Select'
import BackupSelect from 'components/input/reactive/BackupSelect'
import SelectWithOther from 'components/input/reactive/SelectWithOther'
import {selectSaved} from 'store/modal/selectors'
import Toggle from 'components/input/reactive/Toggle'
import ToggleText from 'components/input/reactive/ToggleText'

const storageDropdownTemplate = (option) => {
  return (
    <div>
      <span>{option.name}</span>
      {option.totalAvailableSpace && (
        <span>
            <Filesize bytes={option.totalAvailableSpace}/>, free:{' '}
          <Filesize
            bytes={option.totalAvailableSpace - option.totalUsedSpace}
          />
          </span>
      )}
    </div>
  )
}

export const RestoreModal = ({virtualEnvironment}) => {
  const dispatch = useDispatch()
  const formRef = useRef()

  useEffect(() => {
    dispatch(getRestorableBackups(virtualEnvironment))
  }, [])

  let backups = useSelector(selectBackups)
  let hypervisorManagers = useSelector(selectHypervisorManagers)
  let storages = useSelector(selectHypervisorStorages)
  let filteredStorages = useSelector(selectFilteredHypervisorStorages)
  let clusters = useSelector(selectHypervisorClusters)
  let task = new RestoreAndImportTask()

  const onBackupChange = (e) => {
    dispatch(getHypervisorManagersAvailableForBackup(e.value.guid, virtualEnvironment, task))
  }

  const onHypervisorChange = async (e) => {
    await dispatch(getHypervisorStoragesForHypervisorManager(e.value.guid))
    await dispatch(getHypervisorClustersForHypervisorManager(e.value.guid))
  }

  const onClusterChange = async (selectedClusterUuid) => {
    const cluster = clusters.find(el => el.uuid === selectedClusterUuid);
    dispatch(setFilteredHypervisorStoragesAction(
      !!cluster ?
        storages.filter(storage => {
        return !!storage.clusters && !!storage.clusters.find(el => cluster.guid === el.guid)
        }) :
        []
    ))
  }

  if (useSelector(selectSaved)) {
    formRef.current.handleSubmit()
  }

  return (
    <div className="form">
      <Formik
        enableReinitialize
        innerRef={formRef}
        initialValues={task}
        onSubmit={(values, {setSubmitting}) => {
          dispatch(submitTask(values))
          setSubmitting(false)
        }}
      >
        {({isSubmitting}) => (
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
              component={SelectWithOther}
              change={onClusterChange}
              optionLabel="name"
              label="Import to cluster"
              options={clusters}
            />
            <Field
              name="restoreStorageId"
              component={SelectWithOther}
              itemTemplate={storageDropdownTemplate}
              optionLabel="name"
              label="Import to storage"
              options={filteredStorages}
            />
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
          </Form>
        )}
      </Formik>
    </div>
  )

}
