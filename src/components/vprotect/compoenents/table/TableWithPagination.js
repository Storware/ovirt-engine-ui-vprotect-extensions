import React from 'react'
import PropTypes from 'prop-types'
import {orderBy} from 'lodash'
import * as sort from 'sortabular'
import * as resolve from 'table-resolver'
import {
  customHeaderFormattersDefinition,
  Table
, PaginationRow, paginate, PAGINATION_VIEW, TABLE_SORT_DIRECTION} from 'patternfly-react'

import {compose} from 'recompose'

export const sortingColumns = {
  name: {
    direction: TABLE_SORT_DIRECTION.ASC,
    position: 0
  }
}

export const getSortingColumns = () => sortingColumns || {}

export const sortableTransform = sort.sort({
  getSortingColumns,
  onSort: selectedColumn => {
    this.setState({
      sortingColumns: sort.byColumn({
        sortingColumns: sortingColumns,
        sortingOrder: defaultSortingOrder,
        selectedColumn
      })
    })
  },
  strategy: sort.strategies.byProperty
})

export const sortingFormatter = sort.header({
  sortableTransform,
  getSortingColumns,
  strategy: sort.strategies.byProperty
})


export class TableWithPagination extends React.Component {
  constructor (props) {
    super(props)

    this.customHeaderFormatters = customHeaderFormattersDefinition

    this.state = {
      sortingColumns: {},

      pagination: {
        page: 1,
        perPage: 10,
        perPageOptions: [10, 25, 50, 100]
      },
      sortedPaginatedRows: [],
      pageChangeValue: 1
    }
  }

  static getDerivedStateFromProps (props, state) {
    return {
      ...state,
      sortingColumns: props.sortingColumns
    }
  }

  totalPages = () => {
    const {perPage} = this.state.pagination
    return Math.ceil(this.props.rows.length / perPage)
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
    const {rows, sortingColumns, columns} = this.props
    const {pagination} = this.state
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
    const {sortingColumns, columns} = this.props
    const {pagination, pageChangeValue} = this.state
    const sortedPaginatedRows = this.currentRows()

    return (
      <div>
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
                  rows: sortedPaginatedRows.rows
                })
              }
            }
          }}
        >
          <Table.Header headerRows={resolve.headerRows({columns})} />
          <Table.Body
            rows={sortedPaginatedRows.rows}
            rowKey='guid'
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
      </div>
    )
  }
}

TableWithPagination.propTypes = {
  columns: PropTypes.any.isRequired,
  sortingColumns: PropTypes.any.isRequired,
  rows: PropTypes.array.isRequired
}
