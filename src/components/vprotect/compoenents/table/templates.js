import React from 'react'
import {DateShow} from '../convert/Date'
import {Filesize} from '../convert/Filezize'
import {schedulesService} from '../../services/schedules-service'

export const dateTemplate = (rowData, column) => {
  return <DateShow date={rowData[column.field]} />
}

export const sizeTemplate = (rowData, column) => {
  return <Filesize bytes={rowData[column.field]} />
}

export const booleanTemplate = (rowData, column) => {
  return <div className={'text-center'}>{rowData[column.field] ? <span className='fa fa-check text-success' /> : ''}</div>
}

export const scheduleTimeTemplate = (rowData) => {
  return <span>{schedulesService.getScheduleTimeOrIntervalLabel(rowData)}</span>
}

export const scheduleDaysTemplate = (rowData) => {
  return rowData.daysOfWeek.map(el => {
      return <span>{el.name} </span>
  })
}

export const convertTemplate = (convertValue) => (rowData, column) => {
  return <span>{rowData[column.field] / convertValue}</span>
}
