import React, {useEffect} from 'react'
import {Slider} from 'patternfly-react'
import PropTypes from 'prop-types'
import {InputDate} from '../../compoenents/input/InputDate'

import {Dropdown} from 'primereact/dropdown'
import {useDispatch, useSelector} from 'react-redux'
import {setTaskAction, getBackupDestinationsAndBackupTypes, submitTask} from '../../../../store/backup-modal/actions'
import {selectBackupDestinations, selectBackupTypes, selectTask} from '../../../../store/backup-modal/selectors'
import {selectSaved} from '../../../../store/modal/selectors'

export const BackupModal = ({virtualEnvironments}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getBackupDestinationsAndBackupTypes(virtualEnvironments))
  }, [])

  const task = useSelector(selectTask)
  const backupDestinations = useSelector(selectBackupDestinations)
  const backupTypes = useSelector(selectBackupTypes)

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
        <label>Backup type</label>
        <Dropdown optionLabel='name'
          value={task.backupType}
          options={backupTypes}
          onChange={(event) => dispatch(setTaskAction(
            {
                      ...task,
                      backupType: event.value
                    }
          ))}
        />

        <label>Backup destination</label>
        <Dropdown optionLabel='name'
          value={task.backupDestination}
          options={backupDestinations}
          onChange={(event) => dispatch(setTaskAction(
            {
                      ...task,
                      backupDestination: event.value
                    }
          ))}
        />
      </div>
      <div>
        <label>Priority</label>
        <Slider
          id='slider-one'
          showBoundaries
          value={task.priority}
          tooltip='show'
          input
          onSlide={setPriority}
        />
      </div>
      <div>
        <label>Window start</label>
        <InputDate value={task.windowStart}
          onChange={(e) => dispatch(setTaskAction(
            {
              ...task,
              windowStart: e
            }
          ))} />
      </div>
    </div>
  )
}

BackupModal.propTypes = {
  virtualEnvironments: PropTypes.any.isRequired
}
