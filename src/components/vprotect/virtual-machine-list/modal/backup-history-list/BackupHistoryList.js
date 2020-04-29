import React from 'react'
import PropTypes from 'prop-types'
import * as sort from 'sortabular'
import {
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  TABLE_SORT_DIRECTION
, Grid} from 'patternfly-react'
import {vprotectService} from '../../../../../services/vprotect-service'
import {DateShow} from '../../../convert/Date'
import {Filesize} from '../../../convert/Filezize'
import {TableFilter} from '../../../controls/TableFilter'
import {TableWithPagination} from '../../../controls/TableWithPagination'

export class BackupHistoryList extends React.Component {
  constructor (props) {
    super(props)

    vprotectService.getProtectedEntityBackups(this.props.virtualEnvironmentGuid).then(result => {
      this.setState({
        rows: result,
        filteredRows: result
      })
    })

    const getSortingColumns = () => this.state.sortingColumns || {}

    const sortableTransform = sort.sort({
      getSortingColumns,
      onSort: selectedColumn => {
        this.setState({
          sortingColumns: sort.byColumn({
            sortingColumns: this.state.sortingColumns,
            sortingOrder: defaultSortingOrder,
            selectedColumn
          })
        })
      },
      strategy: sort.strategies.byProperty
    })

    const sortingFormatter = sort.header({
      sortableTransform,
      getSortingColumns,
      strategy: sort.strategies.byProperty
    })

    this.state = {
      sortingColumns: {
        name: {
          direction: TABLE_SORT_DIRECTION.ASC,
          position: 0
        }
      },

      columns: [
        {
          property: 'snapshotTime',
          header: {
            label: 'Snapshot Time',
            props: {
              index: 0,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 0
            },
            formatters: [(value) => {
              return <td><DateShow date={value} timezone={this.props.user.uiTimeZone} /></td>
            }]
          }
        },
        {
          property: 'status',
          header: {
            label: 'Status',
            props: {
              index: 1,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 1
            },
            formatters: [(value) => {
              return <td>{value && <span className={value.name === 'SUCCESS' ? 'text-success' : value.name === 'FAILED' ? 'text-danger' : ''}>{value.description}</span>}</td>
            }]
          }
        },
        {
          property: 'statusInfo',
          header: {
            label: 'Status Info',
            props: {
              index: 2,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 2
            },
            formatters: [(value) => {
              return <td>{value}</td>
            }]
          }
        },
        {
          property: 'type',
          header: {
            label: 'Type',
            props: {
              index: 3,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 3
            },
            formatters: [(value) => {
              return <td>{value && value.description}</td>
            }]
          }
        },
        {
          property: 'size',
          header: {
            label: 'Size',
            props: {
              index: 4,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 4
            },
            formatters: [(value) => {
              return <td><Filesize bytes={value} /></td>
            }]
          }
        }
      ],

      rows: [],
      filteredRows: [],

      pagination: {
        page: 1,
        perPage: 10,
        perPageOptions: [10, 25, 50, 100]
      },

      pageChangeValue: 1,

      selectedVirtualEnvironment: null,
      showBackupModal: false,
      showRestoreModal: false
    }
  }

  filterFields = [
    {
      property: 'statusInfo',
      title: 'Status info',
      placeholder: 'Filter by Status info',
      filterType: 'text'
    }, {
      property: 'status.name',
      title: 'Status',
      placeholder: 'Filter by Status',
      filterType: 'text'
    }
  ]

  render () {
    return (
      <div>
        <Grid fluid>
          <TableFilter fields={this.filterFields} rows={this.state.rows} change={(value) => {
            this.setState({filteredRows: value})
          }} />
          <TableWithPagination columns={this.state.columns} sortingColumns={this.state.sortingColumns}
            rows={this.state.filteredRows} />
        </Grid>
      </div>
    )
  }
}

BackupHistoryList.propTypes = {
  user: PropTypes.any.isRequired,
  virtualEnvironmentGuid: PropTypes.string.isRequired
}
