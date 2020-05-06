import React from 'react'
import * as sort from 'sortabular'
import {
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  TABLE_SORT_DIRECTION
  , Grid, Toolbar, Button, actionHeaderCellFormatter, Table, MenuItem
} from 'patternfly-react'

import {schedulesService} from '../../../services/schedules-service'
import {TableFilter} from '../../../compoenents/controls/TableFilter'
import {TableWithPagination} from '../../../compoenents/controls/TableWithPagination'
import {
  Link,
  withRouter
} from 'react-router-dom'
import PropTypes from 'prop-types'
import {alertService} from '../../../services/alert-service'
import {sourceToViewShiftedDays} from '../../../services/time'

export class SchedulesList extends React.Component {
  constructor (props) {
    super(props)

    schedulesService.getAllTypeSchedules('VM_BACKUP').then(result => {
      result = result.map(el => {
        return {...el, daysOfWeek: sourceToViewShiftedDays(el.daysOfWeek, el.hour)}
      })
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
          property: 'name',
          header: {
            label: 'Name',
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
            formatters: [(value, {rowData}) => {
              return <td>
                <Link to={`${this.props.match.path}/${rowData.guid}`}>
                  {value}
                </Link>
              </td>
            }]
          }
        },
        {
          property: 'active',
          header: {
            label: 'Active',
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
              return <td className={'text-center'}>{value ? <span className='fa fa-check text-success' /> : <span className='fa fa-times text-danger' />}</td>
            }]
          }
        },
        {
          property: 'hour',
          header: {
            label: 'Schedule',
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
            formatters: [(value, {rowData}) => {
              return <td>
                {schedulesService.getScheduleTimeOrIntervalLabel(rowData)}
              </td>
            }]
          }
        },
        {
          property: 'daysOfWeek',
          header: {
            label: 'Days',
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
              return <td>
                {value.map(el => {
                  return <span>{el.name} </span>
                })}
              </td>
            }]
          }
        },
        {
          property: 'backupType',
          header: {
            label: 'Backup Type',
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
            formatters: [value => {
              return <td>
                {value ? value.description : ''}
              </td>
            }]
          }
        },
        {
          property: 'rules',
          header: {
            label: 'Policies',
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
            formatters: [value => {
              return <td>
                {value.length}
              </td>
            }]
          }
        },
        {
          property: 'startWindowLength',
          header: {
            label: 'Start window [min]',
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
            formatters: [value => {
              return <td>
                {value / 1000 / 60 }
              </td>
            }]
          }
        },
        {
          header: {
            label: 'Actions',
            props: {
              index: 7,
              rowSpan: 1,
              colSpan: 1
            },
            formatters: [actionHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 7,
              rowSpan: 1,
              colSpan: 1
            },
            formatters: [
              (value, {rowData}) => {
                return [
                  <Table.Actions key='0'>
                    <Table.DropdownKebab id='myKebab' pullRight>
                      <MenuItem onClick={async () => {
                        await schedulesService.deleteSchedule(rowData.guid)
                        const result = await schedulesService.getAllTypeSchedules('VM_BACKUP')
                        this.setState({
                          rows: result,
                          filteredRows: result
                        })
                        alertService.info('Schedule removed')
                      }}>Remove</MenuItem>
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
      showBackupHistoryListModal: false,
      showRestoreModal: false
    }
  }

  filterFields = [
    {
      property: 'name',
      title: 'Name',
      placeholder: 'Filter by Name',
      filterType: 'text'
    }, {
      property: 'guid',
      title: 'Guid',
      placeholder: 'Filter by Guid',
      filterType: 'text'
    }, {
      property: 'backupDestination.name',
      title: 'Backup Destination',
      placeholder: 'Filter by Backup Destination',
      filterType: 'text'
    }
  ]

  render () {
    return (
      <div>
        <Toolbar>
          <div className={'d-flex flex-row justify-content-between'}>
            <div>
              <TableFilter fields={this.filterFields} rows={this.state.rows} change={(value) => {
                this.setState({filteredRows: value})
              }} />
            </div>
            <div className={'form-group'}>
              <Link to={`${this.props.match.path}/create`}>
                <Button className={'btn btn-default'}>Create</Button>
              </Link>
            </div>
          </div>
        </Toolbar>
        <div className={'pt-4'}>
          <Grid fluid>
            <TableWithPagination columns={this.state.columns}
              sortingColumns={this.state.sortingColumns}
              rows={this.state.filteredRows} />
          </Grid>
        </div>
      </div>
    )
  }
}

SchedulesList.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(SchedulesList)
