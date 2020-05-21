import React from 'react'
import {
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'
import {backupsService} from '../../../services/backups.service'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'
import {sizeTemplate, timeTemplate} from '../../../compoenents/table/templates'

class BackupHistoryTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: []
    }

    this.getData()
  }

  async getData () {
    const data = await backupsService.getProtectedEntityBackups(this.props.match.params.guid)

    this.setState({
      ...this.state,
      data: data
    })
  }

  render () {
    return (
      <div>
        <DataTable value={this.state.data}>
          <Column field='snapshotTime' header='Snapshot time' body={timeTemplate} />
          <Column field='status.description' header='Status' />
          <Column field='statusInfo' header='Status info' />
          <Column field='type.description' header='Type' />
          <Column field='size' header='Size' body={sizeTemplate} />
        </DataTable>
      </div>
    )
  }
}

BackupHistoryTable.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(BackupHistoryTable)
