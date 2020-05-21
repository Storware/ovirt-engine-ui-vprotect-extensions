import React from 'react'
import {DateShow} from '../convert/Date'
import {Filesize} from '../convert/Filezize'

export const timeTemplate = (rowData, column) => {
  return <DateShow date={rowData[column.field]} />
}

export const sizeTemplate = (rowData, column) => {
  return <Filesize bytes={rowData[column.field]} />
}
