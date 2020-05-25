import React from 'react'
import {DateShow} from '../convert/Date'
import {Filesize} from '../convert/Filezize'

export const timeTemplate = (rowData, column) => {
  return <DateShow date={rowData[column.field]} />
}

export const sizeTemplate = (rowData, column) => {
  return <Filesize bytes={rowData[column.field]} />
}

export const booleanTemplate = (rowData, column) => {
  return <div className={'text-center'}>{rowData[column.field] ? <span className='fa fa-check text-success' /> : <span className='fa fa-times text-danger' />}</div>
}
