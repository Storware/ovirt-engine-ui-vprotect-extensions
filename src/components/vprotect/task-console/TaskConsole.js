import React from 'react'
import PropTypes from 'prop-types'
import * as sort from 'sortabular'
import {
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  TABLE_SORT_DIRECTION
} from 'patternfly-react'
import {Grid} from 'patternfly-react'

import {VprotectService} from '../../../services/vprotect-service'
import {DateShow} from '../convert/Date'
import {TableWithPagination} from '../controls/TableWithPagination'
import {MockFilterExample} from '../controls/MockFilterExample'

export class TaskConsole extends React.Component {
  vprotectService = new VprotectService()

  constructor (props) {
    super(props)

    this.vprotectService.getAllTasks().then(result => {
      this.setState({
        rows: result
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
        hypervisorManager: {
          direction: TABLE_SORT_DIRECTION.ASC,
          position: 0
        }
      },

      columns: [
        {
          property: 'state',
          header: {
            label: 'State',
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
              return <td>{value && value.description}</td>
            }]
          }
        },
        {
          property: 'progress',
          header: {
            label: 'Progress',
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
              return <td>{value && `${value}%`}</td>
            }]
          }
        },
        {
          property: 'hypervisorManager',
          header: {
            label: 'Hypervisor',
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
              return <td>{value && value.name}</td>
            }]
          }
        },
        {
          property: 'protectedEntity',
          header: {
            label: 'VE/APP',
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
              return <td>{value && value.name}</td>
            }]
          }
        },
        {
          property: 'node',
          header: {
            label: 'Node',
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
              return <td>{value && value.name}</td>
            }]
          }
        },
        {
          property: 'backupDestination',
          header: {
            label: 'Backup destination',
            props: {
              index: 5,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 5
            },
            formatters: [(value) => {
              return <td>{value && value.name}</td>
            }]
          }
        },
        {
          property: 'priority',
          header: {
            label: 'Priority',
            props: {
              index: 6,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 6
            },
            formatters: [(value) => {
              return <td>{value}</td>
            }]
          }
        },
        {
          property: 'windowStart',
          header: {
            label: 'Window start',
            props: {
              index: 7,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 7
            },
            formatters: [(value) => {
              return <td><DateShow date={value} timezone={this.props.user.uiTimeZone}/></td>
            }]
          }
        },
        {
          property: 'windowEnd',
          header: {
            label: 'Window end',
            props: {
              index: 7,
              rowSpan: 1,
              colSpan: 1
            },
            transforms: [sortableTransform],
            formatters: [sortingFormatter],
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 7
            },
            formatters: [(value) => {
              return <td><DateShow date={value} timezone={this.props.user.uiTimeZone}/></td>
            }]
          }
        },
        // {
        //   header: {
        //     label: 'Actions',
        //     props: {
        //       index: 8,
        //       rowSpan: 1,
        //       colSpan: 1
        //     },
        //     formatters: [actionHeaderCellFormatter]
        //   },
        //   cell: {
        //     props: {
        //       index: 8,
        //       rowSpan: 1,
        //       colSpan: 1
        //     },
        //     formatters: [
        //       (value, {rowData}) => {
        //         return [
        //           <Table.Actions key="0">
        //             <Table.DropdownKebab id="myKebab" pullRight>
        //               <MenuItem onClick={() => {
        //                   this.setState(
        //                     {
        //                       selectedVirtualEnvironment: rowData,
        //                       showBackupModal: true
        //                     }
        //                   );
        //               }}>Backup</MenuItem>
        //               {rowData.lastSuccessfulBackupSize > 0 &&
        //               <MenuItem onClick={() => {
        //                 this.setState({
        //                   selectedVirtualEnvironment: rowData,
        //                   showRestoreModal: true
        //                 })
        //               }}>Restore</MenuItem>}
        //
        //             </Table.DropdownKebab>
        //           </Table.Actions>
        //         ]
        //       }
        //     ]
        //   }
        // }
      ],

      rows: [],

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

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal = () => {
    this.setState({showBackupModal: false, showRestoreModal: false})
  }

  render () {
    return (
      <div>
        <Grid fluid>
          <MockFilterExample />
          <TableWithPagination columns={this.state.columns} sortingColumns={this.state.sortingColumns} rows={this.state.rows}/>
        </Grid>
      </div>
    )
  }
}

TaskConsole.propTypes = {
  user: PropTypes.any.isRequired
}
