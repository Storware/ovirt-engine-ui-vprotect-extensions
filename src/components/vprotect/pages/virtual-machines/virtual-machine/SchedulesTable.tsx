import React from 'react'
import {Column} from 'primereact/column'
import {convertTemplate, booleanTemplate, scheduleTimeTemplate, scheduleDaysTemplate} from '../../../compoenents/table/templates'
import {useSelector} from 'react-redux'
import {selectSchedules} from '../../../../../store/virtual-machine/selectors'
import Table from '../../../compoenents/table/primereactTable';

const SchedulesTable = () => {
  let schedules = useSelector(selectSchedules);

  return (
    <div>
      <Table value={schedules}>
        <Column field='name' header='Name' />
        <Column field='active' header='Active'  body={booleanTemplate}/>
        <Column header='Schedule' body={scheduleTimeTemplate} />
        <Column field='daysOfWeek' header='Days' body={scheduleDaysTemplate}/>
        <Column field='backupType.description' header='Backup type' />
        <Column field='rules.length' header='Policies' />
        <Column field='startWindowLength' header='Start window [min]' body={convertTemplate(60000)} />
      </Table>
    </div>
  )
}

export default SchedulesTable
