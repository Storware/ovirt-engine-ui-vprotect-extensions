import React, { useEffect } from 'react';
import {
  sortableHeaderCellFormatter,
  Grid,
  Toolbar,
  Button,
  actionHeaderCellFormatter,
  Table,
  MenuItem,
} from 'patternfly-react';
import {
  TableWithPagination,
  sortableTransform,
  sortingFormatter,
  sortingColumns,
} from '../../../components/table/TableWithPagination';
import { schedulesService } from '../../../services/schedules-service';
import { TableFilter } from '../../../components/table/TableFilter';
import { alertService } from '../../../services/alert-service';
import { useDispatch, useSelector } from 'react-redux';
import { setFilteredPolicies } from '../../../store/policies/actions';
import { getSchedules, removeSchedule } from '../../../store/schedules/actions';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import {
  selectFilteredSchedules,
  selectSchedules,
} from '../../../store/schedules/selectors';

let filterFields = [
  {
    property: 'name',
    title: 'Name',
    placeholder: 'Filter by Name',
    filterType: 'text',
  },
  {
    property: 'guid',
    title: 'Guid',
    placeholder: 'Filter by Guid',
    filterType: 'text',
  },
  {
    property: 'backupDestination.name',
    title: 'Backup Destination',
    placeholder: 'Filter by Backup Destination',
    filterType: 'text',
  },
];

const SchedulesList = () => {
  const dispatch = useDispatch();
  const { type } = useParams();
  let match = useRouteMatch();
  useEffect(() => {
    dispatch(getSchedules(type));
  }, [type]);

  let rows = useSelector(selectSchedules);
  let filteredRows = useSelector(selectFilteredSchedules);

  let columns = {
    VM_BACKUP: [
      {
        property: 'name',
        header: {
          label: 'Name',
          props: {
            index: 0,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 0,
          },
          formatters: [
            (value, { rowData }) => {
              return (
                <td>
                  <Link to={`/schedules/edit/${type}/${rowData.guid}`}>
                    {value}
                  </Link>
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'active',
        header: {
          label: 'Active',
          props: {
            index: 1,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 1,
          },
          formatters: [
            (value) => {
              return (
                <td className={'text-center'}>
                  {value ? (
                    <span className="fa fa-check text-success" />
                  ) : (
                    <span className="fa fa-times text-danger" />
                  )}
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'hour',
        header: {
          label: 'Schedule',
          props: {
            index: 2,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 2,
          },
          formatters: [
            (value, { rowData }) => {
              return (
                <td>
                  {schedulesService.getScheduleTimeOrIntervalLabel(rowData)}
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'daysOfWeek',
        header: {
          label: 'Days',
          props: {
            index: 3,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 3,
          },
          formatters: [
            (value) => {
              return (
                <td>
                  {value.map((el) => {
                    return <span>{el.name} </span>;
                  })}
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'backupType',
        header: {
          label: 'Backup Type',
          props: {
            index: 4,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 4,
          },
          formatters: [
            (value) => {
              return <td>{value ? value.description : ''}</td>;
            },
          ],
        },
      },
      {
        property: 'rules',
        header: {
          label: 'Policies',
          props: {
            index: 5,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 5,
          },
          formatters: [
            (value) => {
              return <td>{value.length}</td>;
            },
          ],
        },
      },
      {
        property: 'startWindowLength',
        header: {
          label: 'Start window [min]',
          props: {
            index: 6,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 6,
          },
          formatters: [
            (value) => {
              return <td>{value / 1000 / 60}</td>;
            },
          ],
        },
      },
      {
        header: {
          label: 'Actions',
          props: {
            index: 7,
            rowSpan: 1,
            colSpan: 1,
          },
          formatters: [actionHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 7,
            rowSpan: 1,
            colSpan: 1,
          },
          formatters: [
            (value, { rowData }) => {
              return [
                <Table.Actions key="0">
                  <Table.DropdownKebab id="myKebab" pullRight>
                    <MenuItem
                      onClick={async () => {
                        dispatch(removeSchedule(type, rowData.guid));
                      }}
                    >
                      Remove
                    </MenuItem>
                  </Table.DropdownKebab>
                </Table.Actions>,
              ];
            },
          ],
        },
      },
    ],
    SNAPSHOT: [
      {
        property: 'name',
        header: {
          label: 'Name',
          props: {
            index: 0,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 0,
          },
          formatters: [
            (value, { rowData }) => {
              return (
                <td>
                  <Link to={`/schedules/edit/${type}/${rowData.guid}`}>
                    {value}
                  </Link>
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'active',
        header: {
          label: 'Active',
          props: {
            index: 1,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 1,
          },
          formatters: [
            (value) => {
              return (
                <td className={'text-center'}>
                  {value ? (
                    <span className="fa fa-check text-success" />
                  ) : (
                    <span className="fa fa-times text-danger" />
                  )}
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'hour',
        header: {
          label: 'Schedule',
          props: {
            index: 2,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 2,
          },
          formatters: [
            (value, { rowData }) => {
              return (
                <td>
                  {schedulesService.getScheduleTimeOrIntervalLabel(rowData)}
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'daysOfWeek',
        header: {
          label: 'Days',
          props: {
            index: 3,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 3,
          },
          formatters: [
            (value) => {
              return (
                <td>
                  {value.map((el) => {
                    return <span>{el.name} </span>;
                  })}
                </td>
              );
            },
          ],
        },
      },
      {
        property: 'rules',
        header: {
          label: 'Policies',
          props: {
            index: 4,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 4,
          },
          formatters: [
            (value) => {
              return <td>{value.length}</td>;
            },
          ],
        },
      },
      {
        property: 'startWindowLength',
        header: {
          label: 'Start window [min]',
          props: {
            index: 5,
            rowSpan: 1,
            colSpan: 1,
          },
          transforms: [sortableTransform],
          formatters: [sortingFormatter],
          customFormatters: [sortableHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 5,
          },
          formatters: [
            (value) => {
              return <td>{value / 1000 / 60}</td>;
            },
          ],
        },
      },
      {
        header: {
          label: 'Actions',
          props: {
            index: 6,
            rowSpan: 1,
            colSpan: 1,
          },
          formatters: [actionHeaderCellFormatter],
        },
        cell: {
          props: {
            index: 6,
            rowSpan: 1,
            colSpan: 1,
          },
          formatters: [
            (value, { rowData }) => {
              return [
                <Table.Actions key="0">
                  <Table.DropdownKebab id="myKebab" pullRight>
                    <MenuItem
                      onClick={async () => {
                        dispatch(removeSchedule(type, rowData.guid));
                      }}
                    >
                      Remove
                    </MenuItem>
                  </Table.DropdownKebab>
                </Table.Actions>,
              ];
            },
          ],
        },
      },
    ],
  };

  return (
    <div>
      <Toolbar>
        <div className={'d-flex flex-row justify-content-between'}>
          <div>
            <TableFilter
              fields={filterFields}
              rows={rows}
              change={(value) => {
                dispatch(setFilteredPolicies(value));
              }}
            />
          </div>
          <div className={'form-group'}>
            <Link to={`/schedules/edit/${type}/create`}>
              <Button className={'btn btn-default'}>Create</Button>
            </Link>
          </div>
        </div>
      </Toolbar>
      <div className={'pt-4'}>
        <Grid fluid>
          {type && (
            <TableWithPagination
              columns={columns[type]}
              sortingColumns={sortingColumns}
              rows={filteredRows}
            />
          )}
        </Grid>
      </div>
    </div>
  );
};

export default SchedulesList;
