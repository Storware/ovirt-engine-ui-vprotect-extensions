import React from 'react'
import PropTypes from 'prop-types'
import * as sort from 'sortabular'
import {
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  TABLE_SORT_DIRECTION
} from 'patternfly-react'
import {Grid, ProgressBar, Button} from 'patternfly-react'

import {VprotectService} from '../../../services/vprotect-service'
import {DateShow} from '../convert/Date'
import {TableWithPagination} from '../controls/TableWithPagination'
import {TableFilter} from '../controls/TableFilter'
// import {TableFilter} from '../controls/TableFilter'

export class TaskConsole extends React.Component {
  vprotectService = new VprotectService()

  constructor (props) {
    super(props)

    this.vprotectService.getAllTasks().then(result => {
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
              return <td><ProgressBar now={value} label={<span className={'center'}>{value > 4 ? value : ''}</span>}/></td>
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
        {
          header: {
            label: 'Actions',
            props: {
              index: 8,
              rowSpan: 1,
              colSpan: 1
            }
          },
          cell: {
            props: {
              index: 8,
              rowSpan: 1,
              colSpan: 1
            },
            formatters: [
              (value, {rowData}) => {
                return [
                  <Table.Actions key="0">
                    <Table.DropdownKebab id="myKebab" pullRight>
                      <MenuItem onClick={() => {
                          this.setState(
                            {
                              selectedVirtualEnvironment: rowData,
                              showBackupModal: true
                            }
                          );
                      }}>Backup</MenuItem>
                      {rowData.lastSuccessfulBackupSize > 0 &&
                      <MenuItem onClick={() => {
                        this.setState({
                          selectedVirtualEnvironment: rowData,
                          showRestoreModal: true
                        })
                      }}>Restore</MenuItem>}

                    </Table.DropdownKebab>
                  </Table.Actions>
                ]
              }
            ]
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

    this.closeModal = this.closeModal.bind(this)
  }

  closeModal = () => {
    this.setState({showBackupModal: false, showRestoreModal: false})
  }

  filterFields = [
    {
      property: 'state.name',
      title: 'Status',
      placeholder: 'Filter by Status',
      filterType: 'text'
    },   {
      property: 'hypervisorManager.name',
      title: 'Hypervisor',
      placeholder: 'Filter by Hypervisor',
      filterType: 'text'
    },{
      property: 'protectedEntity.name',
      title: 'VE/APP',
      placeholder: 'Filter by VE/APP',
      filterType: 'text'
    },{
      property: 'node.name',
      title: 'Node',
      placeholder: 'Filter by Node',
      filterType: 'text'
    },{
      property: 'backupDestination.name',
      title: 'Backup destination',
      placeholder: 'Filter by Backup destination',
      filterType: 'text'
    }
  ]

  render () {
    return (
      <div>
        <Grid fluid>
          <div className={'d-flex flex-row justify-content-between'}>
            <div>
              <TableFilter fields={this.filterFields} rows={this.state.rows} change={(value) => {this.setState({filteredRows: value})}}/>
            </div>
            <div>
              <Button>Refresh</Button>
              <Button>Delete all finished and queued tasks</Button>
              <Button>Remove all finished tasks</Button>
              <Button>Cancel all running tasks</Button>
            </div>
          </div>
          <TableWithPagination columns={this.state.columns} sortingColumns={this.state.sortingColumns} rows={this.state.filteredRows}/>
        </Grid>
      </div>
    )
  }
}

TaskConsole.propTypes = {
  user: PropTypes.any.isRequired
}
