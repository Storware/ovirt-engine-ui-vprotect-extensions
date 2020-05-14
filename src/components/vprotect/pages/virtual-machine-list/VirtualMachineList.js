import React from 'react'
import PropTypes from 'prop-types'
import * as sort from 'sortabular'
import {
  actionHeaderCellFormatter,
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  tableCellFormatter,
  Table,
  TABLE_SORT_DIRECTION, MenuItem
  , Grid, Toolbar
} from 'patternfly-react'

import {BackupModal} from '../../compoenents/modal/BackupModal'
import {RestoreModal} from './modal/RestoreModal'
import {virtualMachinesService} from '../../services/virtual-machines.service'
import {DateShow} from '../../compoenents/convert/Date'
import {Filesize} from '../../compoenents/convert/Filezize'
import {TableFilter} from '../../compoenents/controls/TableFilter'
import {TableWithPagination} from '../../compoenents/controls/TableWithPagination'
import {BackupHistoryListContainer} from './modal/backup-history-list/BackupHistoryListContainer'

export class VirtualMachineList extends React.Component {
  constructor (props) {
    super(props)

    virtualMachinesService.getVirtualMachines().then(result => {
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
              return <td>{rowData.present ? <a href={`/ovirt-engine/webadmin/#vms-general;name=${value}`} target={'_blank'}>{value}</a> : <span>{value}</span>}</td>
            }]
          }
        },
        {
          property: 'uuid',
          header: {
            label: 'Uuid',
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
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'present',
          header: {
            label: 'Present',
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
              return <td className={'text-center'}>{value ? <span className='fa fa-check text-success' /> : <span className='fa fa-times text-danger' />}</td>
            }]
          }
        },
        {
          property: 'hypervisor',
          header: {
            label: 'Hypervisor',
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
          property: 'vmBackupPolicy',
          header: {
            label: 'Policy',
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
          property: 'backupUpToDate',
          header: {
            label: 'Backup status',
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
              return <td>{value ? <span className='text-success'>Backup up to date</span> : typeof value === 'undefined' ? <span>No schedule defined</span> : <span className='text-danger'>Backup outdated</span>}</td>
            }]
          }
        },
        {
          property: 'lastBackup',
          header: {
            label: 'Last backup date',
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
              return <td><DateShow date={value} timezone={this.props.user.uiTimeZone} /></td>
            }]
          }
        },
        {
          property: 'lastSuccessfulBackupSize',
          header: {
            label: 'Last backup size',
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
              return <td className={'text-right'}><Filesize bytes={value} /></td>
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
            },
            formatters: [actionHeaderCellFormatter]
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
                  <Table.Actions key='0'>
                    <Table.DropdownKebab id='myKebab' pullRight>
                      <MenuItem onClick={() => {
                        this.setState(
                          {
                            selectedVirtualEnvironment: rowData,
                            showBackupModal: true
                          }
                        )
                      }}>Backup</MenuItem>
                      {rowData.lastSuccessfulBackupSize > 0 &&
                      <MenuItem onClick={() => {
                        this.setState({
                          selectedVirtualEnvironment: rowData,
                          showRestoreModal: true
                        })
                      }}>Restore</MenuItem>}
                      <MenuItem onClick={() => {
                        this.setState(
                          {
                            selectedVirtualEnvironment: rowData,
                            showBackupHistoryListModal: true
                          }
                        )
                      }}>Show Backup History</MenuItem>
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

  closeModal = () => {
    this.setState({showBackupModal: false, showBackupHistoryListModal: false, showRestoreModal: false})
  }

  filterFields = [
    {
      property: 'name',
      title: 'Name',
      placeholder: 'Filter by Name',
      filterType: 'text'
    }, {
      property: 'uuid',
      title: 'Uuid',
      placeholder: 'Filter by Uuid',
      filterType: 'text'
    }, {
      property: 'hypervisor.name',
      title: 'Hypervisor',
      placeholder: 'Filter by Hypervisor',
      filterType: 'text'
    }, {
      property: 'vmBackupPolicy.name',
      title: 'Policy',
      placeholder: 'Filter by Policy',
      filterType: 'text'
    }
  ]

  render () {
    return (
      <div>
        <Toolbar>
          <TableFilter fields={this.filterFields} rows={this.state.rows} change={(value) => {
            this.setState({filteredRows: value})
          }} />
        </Toolbar>
        <div className={'pt-4'}>
          <Grid fluid>
            <TableWithPagination columns={this.state.columns} sortingColumns={this.state.sortingColumns}
              rows={this.state.filteredRows} />
          </Grid>
        </div>
        {this.state.showBackupModal &&
        <BackupModal closeModal={this.closeModal}
          virtualEnvironments={[this.state.selectedVirtualEnvironment]} />
        }

        {this.state.showRestoreModal &&
        <RestoreModal closeModal={this.closeModal}
          virtualEnvironment={this.state.selectedVirtualEnvironment} />
        }

        {this.state.showBackupHistoryListModal &&
        <BackupHistoryListContainer closeModal={this.closeModal}
          virtualEnvironment={this.state.selectedVirtualEnvironment} />
        }
      </div>
    )
  }
}

VirtualMachineList.propTypes = {
  user: PropTypes.any.isRequired
}
