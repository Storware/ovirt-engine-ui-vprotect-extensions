import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import {selectSaved} from '../../../../store/modal/selectors'
import {getMountedBackup, setTaskAction, submitTask} from '../../../../store/mount-backup-modal/actions';
import {selectMountableBackups, selectNodes, selectTask} from '../../../../store/mount-backup-modal/selectors';
import {BackupDropdown} from '../../compoenents/input/BackupDropdown'
import InputDropdown from '../input/InputDropdown';

const modes = [
    {
        name: 'Mount filesystems automatically',
        value: { name: 'AUTO' }
    },
    {
        name: 'Specify filesytems to be mounted',
        value: { name: 'MANUAL'}
    },
    {
        name: 'Share drives over iSCSI',
        value: { name: 'ISCSI' }
    }
]

export const MountBackupModal = ({guid}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMountedBackup(guid))
    }, [])

    const task = useSelector(selectTask)
    const mountableBackups = useSelector(selectMountableBackups)
    const nodes = useSelector(selectNodes)

    const setPriority = (value) => {
        dispatch(setTaskAction(
            {
                ...task,
                priority: JSON.parse(value)
            }
        ))
    }

    if (useSelector(selectSaved)) {
        dispatch(submitTask(task))
    }

    return (
        <div>
            <div className='form'>
                <label>Select backup to mount</label>
                <BackupDropdown value={task.backup}
                                required
                                onChange={(event) => dispatch(setTaskAction(
                                    {
                                        ...task,
                                        backup: event.value
                                    }
                                ))}
                                options={mountableBackups}
                />

                <InputDropdown label='Choose node'
                          optionLabel='name'
                          value={task.node}
                          options={nodes}
                          required
                          onChange={(event) => dispatch(setTaskAction(
                              {
                                  ...task,
                                  node: event.value
                              }
                          ))}
                />

                <div className='pt-2'>
                    <InputDropdown optionLabel='name'
                                   value={task.mode}
                                   options={modes}
                                   required
                                   onChange={(event) => dispatch(setTaskAction(
                                       {
                                           ...task,
                                           mode: event.value
                                       }
                                   ))}
                    />
                </div>
            </div>


        </div>
    )
}

MountBackupModal.propTypes = {
    virtualEnvironments: PropTypes.any.isRequired
}
