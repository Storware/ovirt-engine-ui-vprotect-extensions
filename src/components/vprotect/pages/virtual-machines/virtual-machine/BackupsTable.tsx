import React from 'react'
import {Column} from 'primereact/column'
import {sizeTemplate, timeTemplate} from '../../../compoenents/table/templates'
import {useSelector} from 'react-redux'
import {selectBackupsHistory} from '../../../../../store/virtual-machine/selectors'
import Table from '../../../compoenents/table/primereactTable';

const BackupsTable = () => {
  let backupsHistory = useSelector(selectBackupsHistory)

  return (
    <div>
      <Table value={backupsHistory}>
        <Column field='snapshotTime' header='Snapshot time' body={timeTemplate} />
        <Column field='statusInfo' header='Status info' />
        <Column field='type.description' header='Type' />
        <Column field='size' header='Size' body={sizeTemplate} />
      </Table>
    </div>
  )
}

export default BackupsTable
