import React from 'react'
import {Column} from 'primereact/column'
import {timeTemplate, booleanTemplate} from '../../../compoenents/table/templates'
import {useSelector} from 'react-redux'
import {selectSnapshots} from '../../../../../store/virtual-machine/selectors'
import Table from '../../../compoenents/table/primereactTable';

const SnapshotsTable = () => {
  let snapshots = useSelector(selectSnapshots);

  return (
    <div>
      <Table value={snapshots}>
        <Column field='snapshotTime' header='Snapshot time' body={timeTemplate} />
        <Column field='policy' header='Policy' />
        <Column field='uuid' header='UUID' />
        <Column field='current' header='Current for incremental backup'  body={booleanTemplate}/>
      </Table>
    </div>
  )
}

export default SnapshotsTable
