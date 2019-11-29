import React from 'react'
import {orderBy} from 'lodash'
import * as sort from 'sortabular'
import * as resolve from 'table-resolver'
import {
  actionHeaderCellFormatter,
  customHeaderFormattersDefinition,
  defaultSortingOrder,
  sortableHeaderCellFormatter,
  tableCellFormatter,
  Table,
  TABLE_SORT_DIRECTION
} from 'patternfly-react'
import {Grid} from 'patternfly-react'
import {PaginationRow, paginate, PAGINATION_VIEW} from 'patternfly-react'
import {compose} from 'recompose'
import {BackupModal} from './BackupModal'
import {RestoreModal} from './RestoreModal'
import {VprotectService} from '../../services/vprotect-service'
/**
 * Reactabular client side paging based on the following api docs:
 * https://reactabular.js.org/#/data/pagination
 */

export class VirtualMachineList extends React.Component {
  vprotectService = new VprotectService()

  constructor (props) {
    super(props)

    this.vprotectService.getVirtualMachines().then(result => {
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
      // Use property or index dependening on the sortingColumns structure specified
      strategy: sort.strategies.byProperty
    })

    const sortingFormatter = sort.header({
      sortableTransform,
      getSortingColumns,
      strategy: sort.strategies.byProperty
    })

    // enables our custom header formatters extensions to reactabular
    this.customHeaderFormatters = customHeaderFormattersDefinition

    this.state = {

      sortingColumns: {
        name: {
          direction: TABLE_SORT_DIRECTION.ASC,
          position: 0
        }
      },

      // column definitions
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
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'guid',
          header: {
            label: 'Guid',
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
          header: {
            label: 'Actions',
            props: {
              index: 2,
              rowSpan: 1,
              colSpan: 1
            },
            formatters: [actionHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 2,
              rowSpan: 1,
              colSpan: 2
            },
            formatters: [
              (value, {rowData}) => {
                return [
                  <Table.Actions key="0">
                    <Table.Button
                      onClick={() => {
                        this.setState(
                          {
                            selectedVirtualEnvironment: rowData,
                            showBackupModal: true
                          }
                        );
                      }}
                    >
                      Backup
                    </Table.Button>
                    <Table.Button
                      onClick={() => {
                        this.setState({
                          selectedVirtualEnvironment: rowData,
                          showRestoreModal: true
                        })
                      }}
                    >
                      Restore
                    </Table.Button>
                  </Table.Actions>
                ]
              }
            ]
          }
        }
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

  totalPages = () => {
    const {perPage} = this.state.pagination
    return Math.ceil(this.state.rows.length / perPage)
  }
  onPageInput = e => {
    this.setState({pageChangeValue: e.target.value})
  }
  onSubmit = () => {
    this.setPage(this.state.pageChangeValue)
  }
  setPage = value => {
    const page = Number(value)
    if (
      !Number.isNaN(value) &&
      value !== '' &&
      page > 0 &&
      page <= this.totalPages()
    ) {
      let newPaginationState = Object.assign({}, this.state.pagination)
      newPaginationState.page = page
      this.setState({pagination: newPaginationState, pageChangeValue: page})
    }
  }
  onPerPageSelect = (eventKey, e) => {
    let newPaginationState = Object.assign({}, this.state.pagination)
    newPaginationState.perPage = eventKey
    newPaginationState.page = 1
    this.setState({pagination: newPaginationState})
  }
  onFirstPage = () => {
    this.setPage(1)
  }
  onPreviousPage = () => {
    if (this.state.pagination.page > 1) {
      this.setPage(this.state.pagination.page - 1)
    }
  }
  onNextPage = () => {
    const {page} = this.state.pagination
    if (page < this.totalPages()) {
      this.setPage(this.state.pagination.page + 1)
    }
  }
  onLastPage = () => {
    const {page} = this.state.pagination
    const totalPages = this.totalPages()
    if (page < totalPages) {
      this.setPage(totalPages)
    }
  }

  currentRows () {
    const {rows, sortingColumns, columns, pagination} = this.state
    return compose(
      paginate(pagination),
      sort.sorter({
        columns: columns,
        sortingColumns,
        sort: orderBy,
        strategy: sort.strategies.byProperty
      })
    )(rows)
  }

  render () {
    const {columns, pagination, sortingColumns, pageChangeValue} = this.state
    const sortedPaginatedRows = this.currentRows()

    return (
      <div>
        <Grid fluid>
          <Table.PfProvider
            striped
            bordered
            hover
            dataTable
            columns={columns}
            components={{
              header: {
                cell: cellProps => {
                  return this.customHeaderFormatters({
                    cellProps,
                    columns,
                    sortingColumns,
                    rows: sortedPaginatedRows.rows,
                  })
                }
              }
            }}
          >
            <Table.Header headerRows={resolve.headerRows({columns})}/>
            <Table.Body
              rows={sortedPaginatedRows.rows}
              rowKey="guid"
            />
          </Table.PfProvider>
          <PaginationRow
            viewType={PAGINATION_VIEW.TABLE}
            pagination={pagination}
            pageInputValue={pageChangeValue}
            amountOfPages={sortedPaginatedRows.amountOfPages}
            itemCount={sortedPaginatedRows.itemCount}
            itemsStart={sortedPaginatedRows.itemsStart}
            itemsEnd={sortedPaginatedRows.itemsEnd}
            onPerPageSelect={this.onPerPageSelect}
            onFirstPage={this.onFirstPage}
            onPreviousPage={this.onPreviousPage}
            onPageInput={this.onPageInput}
            onNextPage={this.onNextPage}
            onLastPage={this.onLastPage}
            onSubmit={this.onSubmit}
          />
        </Grid>

        {this.state.showBackupModal &&
          <BackupModal  closeModal={this.closeModal}
                        virtualEnvironment={this.state.selectedVirtualEnvironment}/>
        }

        {this.state.showRestoreModal &&
          <RestoreModal  closeModal={this.closeModal}
                         virtualEnvironment={this.state.selectedVirtualEnvironment}/>
        }

      </div>
    )
  }
}
